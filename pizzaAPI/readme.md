

# A Pizza-Delivery API

*No NPM.*  
*No Packages.*  
*Just Node.*  
This is an API for a mock pizza-delivery company, an exercise in executing a node server with no npm dependencies.  

## Table Of Contents
[Third Party Integrations](#third-party-api-integrations) 
[User Stories](#user-stories)
[API](#api) 
- [Frontend](#frontend)
- [Backend](#backend)
	- [Users](#users)
	- [Menu Items](#menu-items)
	- [Charge](#charge)

## Third Party API Integrations
This integrates with the sandbox of [Stripe](https://stripe.com/)for accepting user payment.  
This integrates with the sandbox of [Mailgun](https://www.mailgun.com) for sending order receipts via email.  
  
  
## User Stories  
**Users Can:**  
- Create/Read/Update/Delete User account data
	- storing Name, Email & Street Address  
- Login & Logout  
	- Creating & Destroying an access token  
- Get PizzaShop Menu items (when logged in)  
- Fill a 'shopping cart' with menu items (when logged in)  
- Create an Order (when logged in)  
	- input payment method  (_dummy by default for dev purpose_)
	- API connects with Stripe API for payment processing  
	- User receives an emailed receipt with Mailgun integration  
  
  
# API
This node api serves 'frontend' && 'backend' content.

## Frontend
```/``` - 'Home' page
```/account/create``` - Create an account
```/account/edit``` - edit an account
```/menu``` - See && Select menu items
```/cart``` - View your cart
```/checkout``` - Checkout, pay with a fake credit card number
```/cart``` - View your cart
```/session/create``` - A login page
```/session/delete``` - A logout page
```/favicon.ico``` - A Favicon
```/public``` - a root for public assets (_images_)
```/notFound``` - A placeholder for routes that are, well, _not found_

## Backend
### USERS  

	/users  

***CREATE (post)***   
*required in body:*  
- FirstName  
- LastName  
- phoneNumber  
- emailAddress  
- streetAddress  
- password
- tosAgreement (terms of service)

***UPDATE (put)***  
*required in url parameter:*  
- email  
  
*required in body:*  
- email
- at least one of the following for editing:  
	- firstName  
	- lastName  
	- streetAddress  
	- emailAddress  
	- userName  


*required in header:* 
- token  

 ***DELETE***   
*required in url:*  
   - email  

*required in header:*  
   - token  

### MENU ITEMS  
***READ (get)***  

	/menuItems?email=userEmail@here.com  

requires:  
- authToken in the request body  
- user email in request query string  

### CHARGE  
***CREATE***  

	/charge  

requires:  
- authToken in the request header  
- user email in request body  