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
- GET Pizza Menu items (when logged in)  
- Fill a 'shopping cart' with menu items (when logged in)  
- Create an Order (when logged in)  
	- input payment method  
	- API connects with Stripe API for payment processing  
	- User recieves an emailed recipet with Mailgun integration  
  
  
### API
## Users  

	/user  

***CREATE (post)***   
requires:  
- FirstName  
- LastName  
- userName  
- emailAddress  
- streetAddress  
- acceptedTOSAgreement (terms of service)

***UPDATE (put)***  
requires:  
- userName  
- password  
- authToken  
- at least one of the following for editing:  
	- firstName  
	- lastName  
	- streetAddress  
	- emailAddress  
	- userName  

***DELETE***   


## MENU ITEMS  

	/menuItems  

***GET***  
requires:  
- authToken  



	



## Start the server
Clone the directory,  
Open a command-line of sorts,  
run _node index.js_  
The terminal should print that the server is running on port 3000!

## Testing & 'Using' the API
Try using [Postman](https://www.getpostman.com/)  