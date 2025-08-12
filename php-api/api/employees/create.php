
<?php
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, "Method not allowed");
}

$data = json_decode(file_get_contents("php://input"));

if (empty($data->firstName) || empty($data->lastName)) {
    sendResponse(false, "First name and last name are required");
}

try {
    // Generate new employee ID
    $query = "SELECT MAX(EMPID) as max_id FROM tblemployees";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $newEmpId = ($result['max_id'] ?? 0) + 1;
    
    $query = "INSERT INTO tblemployees (
                EMPID, FNAME, LNAME, MNAME, ADDRESS, BIRTHDATE, BIRTHPLACE, 
                AGE, SEX, CIVILSTATUS, TELNO, EMP_EMAIL, POSITION, STARTDATE, 
                COMPANYID, DEPARTMENTID, EMPPHOTO
              ) VALUES (
                :empId, :firstName, :lastName, :middleName, :address, :birthDate, 
                :birthPlace, :age, :sex, :civilStatus, :telNo, :email, :position, 
                :startDate, :companyId, :departmentId, :photo
              )";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':empId', $newEmpId);
    $stmt->bindParam(':firstName', $data->firstName);
    $stmt->bindParam(':lastName', $data->lastName);
    $stmt->bindParam(':middleName', $data->middleName ?? '');
    $stmt->bindParam(':address', $data->address ?? '');
    $stmt->bindParam(':birthDate', $data->birthDate ?? null);
    $stmt->bindParam(':birthPlace', $data->birthPlace ?? '');
    $stmt->bindParam(':age', $data->age ?? null);
    $stmt->bindParam(':sex', $data->sex ?? '');
    $stmt->bindParam(':civilStatus', $data->civilStatus ?? '');
    $stmt->bindParam(':telNo', $data->telNo ?? '');
    $stmt->bindParam(':email', $data->email ?? '');
    $stmt->bindParam(':position', $data->position ?? '');
    $stmt->bindParam(':startDate', $data->startDate ?? date('Y-m-d'));
    $stmt->bindParam(':companyId', $data->companyId ?? null);
    $stmt->bindParam(':departmentId', $data->departmentId ?? null);
    $stmt->bindParam(':photo', $data->photo ?? '');
    
    if ($stmt->execute()) {
        sendResponse(true, "Employee created successfully", array("empId" => $newEmpId));
    } else {
        sendResponse(false, "Failed to create employee");
    }
    
} catch (Exception $e) {
    sendResponse(false, "Error creating employee: " . $e->getMessage());
}
?>
