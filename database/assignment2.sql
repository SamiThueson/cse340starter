-- Data for table account
INSERT INTO account (
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )
VALUES (
    'Tony',
    'Stark',
    'tony@starkent.com',
    'Iam1ronM@n'
  );
-- Updates account_type for Tony Stark
UPDATE account
SET account_type = 'Admin'
WHERE account_id = 1;
-- Deletes Tony Stark record
DELETE FROM account
WHERE account_firstname = 'Tony'
  AND account_lastname = 'Stark';

-- Modifys the "GM Hummer" record
UPDATE inventory
SET inv_description = REPLACE (inv_description, 'the small interior', 'a huge interior')
WHERE inv_id = 10;

-- Query to show "sport" classification
SELECT inv_make, inv_model, classification_name
FROM inventory inv
	JOIN classification class
	ON inv.classification_id = class.classification_id
WHERE classification_name = 'Sport';

-- Updates the image paths
UPDATE inventory
SET inv_thumbnail = REPLACE(inv_thumbnail, 's/', 's/vehicles/'), 
	inv_image = REPLACE(inv_image, 's/', 's/vehicles/');