CREATE DATABASE INVENTORY;
USE INVENTORY;

CREATE TABLE Users (
    Email VARCHAR(255) NOT NULL UNIQUE PRIMARY KEY,
    PasswordHash VARCHAR(255) NOT NULL,
    AccessRole VARCHAR(50) NOT NULL,
    FullName VARCHAR(255) NOT NULL
);

CREATE TABLE Equipment (
    EquipmentID INT AUTO_INCREMENT PRIMARY KEY,
    EquipmentName VARCHAR(255) NOT NULL,
    Make VARCHAR(255),
    Model VARCHAR(255),
    SerialNumber VARCHAR(255),
    Status VARCHAR(50) NOT NULL
);

CREATE TABLE Transactions (
    TransactionID INT AUTO_INCREMENT PRIMARY KEY,
    EquipmentID INT NOT NULL,
    PersonName VARCHAR(255),
    CompanyName VARCHAR(255),
    PhoneNumber VARCHAR(20),
    Status VARCHAR(50) NOT NULL,
    RequestDate DATE NOT NULL,
    ApprovedDate DATE,
    ExpectedReturnDays INT,
    ReturnDate DATE,
    RequestForm VARCHAR(255)
);


-- insert values to equipment table
INSERT INTO Equipment (EquipmentName, Make, Model, SerialNumber, Status) VALUES
('AIRBORNE PARTICLE COUNTER', 'FLUKE', '985', '1506994515', 'AVAILABLE'),
('ANEMOMETER', 'LUTRON', 'AM-4201', 'QC-2E9W-ZKRU', 'AVAILABLE'),
('DEFIBRILLATOR ANALYZER', 'FLUKE', 'IMPULSE 7000DP', '3079017', 'AVAILABLE'),
('DIGITAL ELECTRONIC BALANCE', 'METTLER TOLEDO', 'JE W103CE', '2737451029', 'AVAILABLE'),
('DIGITAL LIGHT METER', 'KUSAM  MECO', 'KM-LUX-200K', 'S875770', 'AVAILABLE'),
('DIGITAL MULTIMETER', 'FLUKE', '289', '37660134', 'AVAILABLE'),
('DIGITAL POWER LOGGER', 'FLUKE', '1738', '-', 'AVAILABLE'),
('DIGITAL POWER QUALITY ANALYZER', 'FLUKE', '435-II', '22563117', 'AVAILABLE'),
('DIGITAL PRESSURE INDICATOR', 'KAVLICO', 'PTE5000/PIC101N', '1701J01-N129', 'AVAILABLE'),
('DIGITAL SOUNDLEVEL METER', 'FLUKE', '945', '62900357', 'AVAILABLE'),
('DIGITAL STOPWATCH', 'RACER', '-', 'SW01', 'AVAILABLE'),
('DIGITAL THERMOHYGROMETER1', 'HTC', 'BE 002139', '002139-1', 'AVAILABLE'),
('DIGITAL THERMOHYGROMETER2', 'HTC', 'BE 002139', '002139-2', 'AVAILABLE'),
('DIGITAL THERMOMETER', 'FLUKE', '54 II B', '40500671Ws', 'AVAILABLE'),
('DOCUMENTING PROCESS CALIBRATOR', 'FLUKE', '754', '3989014', 'AVAILABLE'),
('PRESSURE MODULE', 'FLUKE', '750P27', '4043351', 'AVAILABLE'),
('LOW PRESURE PUMP', 'FLUKE', '700LTP1', '4107531', 'AVAILABLE'),
('ELECTRICAL SAFETY ANALYSER', 'FLUKE', 'ESA615', '3982555', 'AVAILABLE'),
('ELECTRO SURGERY ANALYZER', 'FLUKE', 'QA-ES111', '4025001', 'AVAILABLE'),
('FETAL SIMULATOR', 'FLUKE', 'PS-320', '5178018', 'AVAILABLE'),
('FLUE GAS ANALYZER', 'TESTO INDIA Pvt Ltd', 'TESTO 310', '63458030', 'AVAILABLE'),
('EXHAUST GAS/ TEMPERATURE SENSOR', 'TESTO INDIA Pvt Ltd', 'nan', '20976940', 'AVAILABLE'),
('GAS FLOW ANALYZER', 'FLUKE', 'VT PLUS HF', '2861032', 'AVAILABLE'),
('INCUBATOR ANALYZER', 'DATA TREND', 'V-PAD-IN', 'VIN24030315', 'AVAILABLE'),
('INFUSION ANALYZER', 'FLUKE', 'IDA-1S', '3579270', 'AVAILABLE'),
('IR THERMOMETER', 'FLUKE', '62 MAX', '-', 'AVAILABLE'),
('IRRADIANCE METER', 'FLUKE', 'IRR1-SOL', '54170006', 'AVAILABLE'),
('PULSE OXIMETER ANALYZER', 'FLUKE', 'SPOTLIGHT', '3597030', 'AVAILABLE'),
('R-TYPE THERMOCOUPLE', 'TEMPSENS INSTRUMENTS', '-', '1605', 'AVAILABLE'),
('SMART TEST LUNG', 'RIGEL MEDICAL', 'SMARTLUNG 2000', '302.730.100', 'AVAILABLE'),
('TACHOMETER', 'LUTRON', '2234C', '-', 'AVAILABLE'),
('THERMAL IMAGER', 'FLUKE', 'Ti400', '14110349', 'AVAILABLE'),
('VITAL SIGN SIMULATOR', 'FLUKE', 'PROSIM 4', '4117003', 'AVAILABLE'),
('AIRFLOW METER', 'FLUKE', '922', '62760102', 'AVAILABLE'),
('ULTRASONIC INSPECTION SYSTEM', 'UE SYSTEMS', 'ULTRAPROBE 15000', '181014', 'AVAILABLE'),
('ULTRASONIC FLOW METER', 'BM TECHNOLOGIES', 'TTFM100B-HH-NG', '2017000007729', 'AVAILABLE'),
('EARTH GROUND TESTER', 'FLUKE', '1621', 'S144408038A3', 'AVAILABLE'),
('VIBRATION ANALYZER', 'FLUKE', '810', '3170013', 'AVAILABLE'),
('FURNACE', 'FLUKE', '9150', 'B82794', 'AVAILABLE'),
('ULTRASONIC TESTING PACKAGE (NDT)', 'GE', 'USM GO ADVANCED', 'GOPLS19060219', 'AVAILABLE');

-- Inserting multiple records into the Transactions table in a single INSERT statement

INSERT INTO Transactions (EquipmentID, PersonName, CompanyName, PhoneNumber, Status, RequestDate, ApprovedDate, ExpectedReturnDays, ReturnDate, RequestForm) 
VALUES 
(1, 'John Doe', 'ABC Corp', '1234567890', 'ISSUED', '2024-08-01', '2024-08-02', 30, '2024-09-01', 'request_form_1.pdf'),
(2, 'Jane Smith', 'XYZ Inc', '0987654321', 'ISSUED', '2024-08-05', '2024-08-06', 45, '2024-09-19', 'request_form_2.pdf'),
(3, 'Alice Johnson', 'Tech Solutions', '2345678901', 'REQUESTED', '2024-08-10', NULL, 30, NULL, 'request_form_3.pdf'),
(4, 'Bob Brown', 'Innovate Ltd', '3456789012', 'REQUESTED', '2024-08-12', NULL, 60, NULL, 'request_form_4.pdf'),
(5, 'Charlie Green', 'FutureTech', '4567890123', 'RETURN_REQUESTED', '2024-07-15', '2024-07-20', 30, '2024-08-14', 'request_form_5.pdf'),
(6, 'David White', 'Visionary Designs', '5678901234', 'RETURN_REQUESTED', '2024-07-18', '2024-07-22', 40, '2024-08-28', 'request_form_6.pdf'),
(7, 'Eve Black', 'Creative Minds', '6789012345', 'FACULTY_APPROVED', '2024-08-20', '2024-08-21', 50, '2024-10-09', 'request_form_7.pdf'),
(8, 'Frank Blue', 'Tech Innovators', '7890123456', 'FACULTY_APPROVED', '2024-08-22', '2024-08-23', 35, '2024-09-26', 'request_form_8.pdf'),
(9, 'Grace Red', 'Pioneers Ltd', '8901234567', 'RETURN_FACULTY_APPROVED', '2024-08-01', '2024-08-05', 25, '2024-08-26', 'request_form_9.pdf'),
(10, 'Hank Yellow', 'Startup Hub', '9012345678', 'RETURN_FACULTY_APPROVED', '2024-08-02', '2024-08-06', 30, '2024-08-31', 'request_form_10.pdf'),
(11, 'Ivy Green', 'Enterprise Co.', '0123456789', 'DEAN_IRD_APPROVED', '2024-08-07', '2024-08-10', 20, '2024-08-30', 'request_form_11.pdf'),
(12, 'Jack Purple', 'Tech Giants', '1123456789', 'DEAN_IRD_APPROVED', '2024-08-09', '2024-08-12', 45, '2024-09-23', 'request_form_12.pdf'),
(13, 'Kathy White', 'Global Innovations', '2123456789', 'DEAN_ADMIN_APPROVED', '2024-08-15', '2024-08-18', 30, '2024-09-16', 'request_form_13.pdf'),
(14, 'Leo Brown', 'Bright Future', '3123456789', 'DEAN_ADMIN_APPROVED', '2024-08-17', '2024-08-20', 60, '2024-10-17', 'request_form_14.pdf');

-- Sample user details (password is hashed and stored in the users table)

-- ('john.doe@abc.com', 'hashedpassword1', 'STAFF', 'John Doe')
-- ('jane.smith@xyz.com', 'hashedpassword2', 'FACULTY', 'Jane Smith')
-- ('alice.johnson@techsolutions.com', 'hashedpassword3', 'DEAN_IRD', 'Alice Johnson')
-- ('bob.brown@innovateltd.com', 'hashedpassword4', 'DEAN_ADMIN', 'Bob Brown')
-- ('charlie.green@futuretech.com', 'hashedpassword5', 'PRINCIPAL', 'Charlie Green')
