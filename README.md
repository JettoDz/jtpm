# jtpm
Backend for your own password manager implementation on Node and PostgresSQL

On hiatus due to life and Heroku's change of heart. :C

For short, this project 

* Generate a string from random bytes.
* Hash the string with BCrypt
* Randomly shift characters in the hashed script
* Safely store the shifted string in the DB engine of choise
* Encrypt the shifted string with Blowfish (Later on, I decided to use AES instead)
* Send back the encrypted shifted password

This project is intened for other developers to use, so they can tweak the level of randomness or security to their liking. In a way, this project is a template.

This project can also be used as a dumb password generator if you don't trust Mozilla's, Google's or Samsung's options and use it with their password storage.
