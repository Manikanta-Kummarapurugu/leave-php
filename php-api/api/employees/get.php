
<?php
include_once '../../config/database.php';

header('Content-Type: application/json');

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!empty($_GET['id'])) {
        $query = "SELECT EMPID, EMPNAME, EMPPOSITION, USERNAME, ACCSTATUS, EMPSEX, COMPANY, DEPARTMENT, EMPLOYID, AVELEAVE FROM tblemployee WHERE EMPID = :id LIMIT 1";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $_GET['id']);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            $employee = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode($employee);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Employee not found"
            ]);
        }
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Employee ID required"
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "message" => "Only GET method allowed"
    ]);
}
?>
