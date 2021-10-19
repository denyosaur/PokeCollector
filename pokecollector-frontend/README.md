Pokecollector
=====================================

Mock ecommerce website that lets users purchase a handful of pokemon cards, and build decks. 
https://pokecollector.herokuapp.com/

Purpose
-------

The purpose of this project is to practice and present my skills for both front-end and back-end. eCommerce sites are very common around the web, so I wanted to make an attempt at building one out from scratch. Although the site does not accept or use any form of real currency (the user can add as much money as they want), the site attempts to mimic the exact userflow from real ecommerce sites. 

Some userflows include being able to view products while not logged in, having a shopping cart persist through logins/logouts, deleting/updating the shopping card, and registering and logging in. On top of ecommerce userflows, the user can view the products they purchased and organize them into specific categories (decks).

Features
-------
* ** Homepage that describes what can be done on the site.
* ** Users are able to login and register.
    * ** Logged in users are able to update their information and add funds.
* ** Ability to view all products available for purchase without having to login through store page.
    * ** Ability to filter through products - filter by name, minimum price, maximum price, rarity, pokemon type, and set name.
    * ** Users are able to add cards to their cart through the store page. They don't have to be logged in.
    * ** Products can be clicked on to view more details.
* ** Shopping cart functionality that persists through logins and logouts.
    * ** Shopping cart is handle through a combination of state and local storage.
    * ** Users can remove or increment items in their cart.
    * ** Purchasing is only available for users who are logged in.
* ** Ability to view cards that the user owns.
    * ** After logging in, the user is able to view all the cards they owned.
    * ** This page allows uers to filter through all their cards similar to the store page. 
* ** Once users are logged in, they can create mock decks with the cards they own.
    * ** New decks can be created and deleted.
    * ** Decks can be named and renamed, and images covers for the decks can be chosen from the cards that they selected for their deck.
* ** There is a special page that only admins are able to view
    * ** Admins are able to view a list of all users and delete or create new users or admins.
    * ** Admins can view all cards and their information currently in the database.
    * ** Admins are able to add new cards to the database from an external API. 

API
-------
* ** Only one external API was used for this project. https://pokemontcg.io/
    * ** This API is used to pull in information about cards and added directly to the database.