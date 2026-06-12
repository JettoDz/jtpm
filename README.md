# jtpm
Backend for your own password manager implementation on Node and PostgresSQL

On hiatus due to life and Heroku's change of heart. :C

## Overview

This project experiments with generating passwords in a deliberately non-standard way. The intended flow is:

* Generate a string from random bytes.
* Hash the string with BCrypt.
* Randomly tamper with the hash so the original bcrypt output can no longer be reconstructed or verified.
* Store the tampered string in the DB engine of choice.
* Encrypt the tampered string with AES for transport to a trusted client that owns the shared key.
* Return the encrypted value to the client.

The core idea is not to preserve the hash for later verification, but to use the bcrypt output as a high-entropy intermediate value and then intentionally corrupt it into a password-like token that is hard to predict from outside the generation process.

## Algorithm notes

The string tampering logic lives in `src/utilities/util.ts`, mainly in `format()`.

This is a custom algorithm implementation for generating password-like strings from a bcrypt-derived intermediate value.
In this implementation it hashes cryptographically random bytes with bcrypt, discards the bcrypt prefix, samples every second character from the remaining hash, and randomly replaces many of those sampled characters with symbols from a small auxiliary alphabet so the original bcrypt output cannot be reconstructed.
This implementation seems acceptable for this usage only if the goal is one-way password generation rather than password verification, because the tampering intentionally destroys information and therefore breaks the usual properties one would expect from a stored password hash.

### Assessment

**What it does well**

* Uses cryptographic randomness as the initial entropy source.
* Uses bcrypt as a costly mixing step before tampering.
* Produces outputs that are not trivially traceable to the original random bytes or the original bcrypt string.
* Separates generation from transport by keeping AES conceptually as a transport layer.

**Limitations**

* The tampering step is custom and not backed by a standard security property or formal analysis.
* The output is intentionally non-verifiable, so it should not be treated as a password hash or proof of knowledge.
* Because it samples only part of the bcrypt output and replaces some of it from a small fixed alphabet, part of the final distribution is shaped by implementation choices rather than purely by raw entropy.
* The current repository implementation appears inconsistent with the intended design in some places: generation is visible, but the AES transport step is not applied in the main creation path.

### Suggestions

**Performance**

* If the final goal is only password generation, bcrypt may be more expensive than necessary. Directly encoding random bytes with a controlled alphabet could be cheaper while remaining secure.
* If bcrypt is kept for intentional slowdown and mixing, document that this is a design choice rather than a storage-hashing requirement.

**Robustness**

* Use `randomBytes(...).toString('base64url')` or `toString('hex')` for the initial printable random source instead of the default string conversion.
* Consider documenting the expected output length and character classes of `format()` so future changes remain compatible with clients.
* Move the random entries in the auxiliary alphabet inside the generation function if they are intended to vary per generated password rather than per server process.

**Reliability**

* Ensure the `/new` and `/get` flows actually apply AES consistently if encrypted transport is part of the contract.
* Clarify in the README and in code comments that the tampered value is a generated secret, not a verifiable password hash.
* Keep server-side and client-side responsibilities explicit: the server generates and encrypts, the client decrypts and stores/uses the resulting password.

**Security**

* If AES is used for transport, prefer an authenticated encryption mode and document IV/nonce handling.
* Make sure decryption restores text using the correct encoding on the client and server implementations.
* Treat the shared AES key as transport-only material and rotate or compartmentalize it if multiple clients are expected.

This project is intended for other developers to use, so they can tweak the level of randomness or security to their liking. In a way, this project is a template.

This project can also be used as a dumb password generator if you don't trust Mozilla's, Google's or Samsung's options and use it with their password storage.
