# A Pizza-Delivery API

*No NPM.*  
*No Packages.*  
*Just Node.*  
This is an example API for a pizza-delivery company.  
  
**3rd Party API Integration**  
This integrates with the sandbox of [Stripe](https://stripe.com/)for accepting user payment.  
This integrates with the sandbox of [Mailgun](https://www.mailgun.com) for sending order receipts via email.  
  
## User Stories  
**Users Can:**  
- Create Account  
	- storingName, Email & Street Address  
- Edit stored info  
- Delete account  
- Login & Logout  
	- Creating & Destroying an access token  
- GET PizzaShop Menu items (when logged in)  
- Fill a 'shopping cart' with menu items (when logged in)  
- Create an Order (when logged in)  
	- input payment method  
	- API connects with Stripe API for payment processing  
	- User recieves an emailed recipet with Mailgun integration  
  
  
# API
## USERS  

	/user  

***CREATE (post)***   
required in body:  
- FirstName  
- LastName  
- userName  
- emailAddress  
- streetAddress  
- acceptedTOSAgreement (terms of service)

***UPDATE (put)***  
required in body:  
- email
- password  

required in header:  
- token  
- at least one of the following for editing:  
	- firstName  
	- lastName  
	- streetAddress  
	- emailAddress  
	- userName  

***DELETE***   
required in url:  
   - email  

required in header:  
   - token  

## MENU ITEMS  
***READ (get)***  

	/menuItems?email=userEmail@here.com  

requires:  
- authToken in the request body  
- user email in request query string  

## CHARGE  
***CREATE (post)***  

	/charge  

requires:  
- authToken in the request header  
- user email in request body  