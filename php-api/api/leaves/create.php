
<?php
include_once '../../config/database.php';

header('Content-Type: application/json');

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->EMPLOYID) && !empty($data->DATESTART) && !empty($data->DATEEND) && !empty($data->SHIFTTIME)) {
        // Calculate number of days
        $dateStart = new DateTime($data->DATESTART);
        $dateEnd = new DateTime($data->DATEEND);
        $diff = $dateStart->diff($dateEnd);
        
        $nodays = 0;
        if ($data->SHIFTTIME == 'AM' || $data->SHIFTTIME == 'PM') {
            $nodays = ((1 + $diff->days) / 2);
        } elseif ($data->SHIFTTIME == 'All Day') {
            $nodays = (1 + $diff->days);
        }
        
        $query = "INSERT INTO tblleave (EMPLOYID, DATESTART, DATEEND, NODAYS, SHIFTTIME, TYPEOFLEAVE, REASON, LEAVESTATUS, ADMINREMARKS, DATEPOSTED) 
                  VALUES (:employid, :datestart, :dateend, :nodays, :shifttime, :typeofleave, :reason, 'PENDING', 'N/A', :dateposted)";
        
        $stmt = $db->prepare($query);
        
        $dateposted = date('Y-m-d');
        
        $stmt->bindParam(":employid", $data->EMPLOYID);
        $stmt->bindParam(":datestart", $data->DATESTART);
        $stmt->bindParam(":dateend", $data->DATEEND);
        $stmt->bindParam(":nodays", $nodays);
        $stmt->bindParam(":shifttime", $data->SHIFTTIME);
        $stmt->bindParam(":typeofleave", $data->TYPEOFLEAVE);
        $stmt->bindParam(":reason", $data->REASON);
        $stmt->bindParam(":dateposted", $dateposted);
        
        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Leave application created successfully"
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Failed to create leave application"
            ]);
        }
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Required fields missing"
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "message" => "Only POST method allowed"
    ]);
}
?>
