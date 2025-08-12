
<?php
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

try {
    $query = "SELECT e.EMPID, e.FNAME, e.LNAME, e.MNAME, e.ADDRESS, e.BIRTHDATE, 
                     e.BIRTHPLACE, e.AGE, e.SEX, e.CIVILSTATUS, e.TELNO, e.EMP_EMAIL,
                     e.POSITION, e.STARTDATE, e.EMPPHOTO, e.COMPANYID, e.DEPARTMENTID,
                     c.COMPANYNAME, d.DEPARTMENT, d.DESCRIPTION as DEPT_DESC
              FROM tblemployees e 
              LEFT JOIN tblcompany c ON e.COMPANYID = c.COMPANYID 
              LEFT JOIN tbldepartment d ON e.DEPARTMENTID = d.DEPARTMENTID 
              ORDER BY e.FNAME, e.LNAME";
    
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $employees = array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $employees[] = array(
            "id" => $row['EMPID'],
            "firstName" => $row['FNAME'],
            "lastName" => $row['LNAME'],
            "middleName" => $row['MNAME'],
            "address" => $row['ADDRESS'],
            "birthDate" => $row['BIRTHDATE'],
            "birthPlace" => $row['BIRTHPLACE'],
            "age" => $row['AGE'],
            "sex" => $row['SEX'],
            "civilStatus" => $row['CIVILSTATUS'],
            "telNo" => $row['TELNO'],
            "email" => $row['EMP_EMAIL'],
            "position" => $row['POSITION'],
            "startDate" => $row['STARTDATE'],
            "photo" => $row['EMPPHOTO'],
            "companyId" => $row['COMPANYID'],
            "departmentId" => $row['DEPARTMENTID'],
            "companyName" => $row['COMPANYNAME'],
            "departmentName" => $row['DEPARTMENT'],
            "departmentDescription" => $row['DEPT_DESC']
        );
    }
    
    sendResponse(true, "Employees retrieved successfully", $employees);
    
} catch (Exception $e) {
    sendResponse(false, "Error retrieving employees: " . $e->getMessage());
}
?>
