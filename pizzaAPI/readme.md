
# A Pizza-Delivery API

*No NPM.*  
*No Packages.*  
*Just Node.*  
This is an API for a mock pizza-delivery company.  
  
**3rd Party API Integrations**  
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
	- input payment method  
	- API connects with Stripe API for payment processing  
	- User recieves an emailed recipet with Mailgun integration  
  
  
# API
## USERS  

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

## MENU ITEMS  
***READ (get)***  

	/menuItems?email=userEmail@here.com  

requires:  
- authToken in the request body  
- user email in request query string  

## CHARGE  
***CREATE***  

	/charge  

requires:  
- authToken in the request header  
- user email in request body  