
<?php
include_once '../../config/database.php';

header('Content-Type: application/json');

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->LEAVEID) && !empty($data->LEAVESTATUS)) {
        // Get employee details for leave balance update
        $leave_query = "SELECT l.*, e.AVELEAVE, e.EMPID FROM tblleave l 
                       JOIN tblemployee e ON l.EMPLOYID = e.EMPLOYID 
                       WHERE l.LEAVEID = :leaveid LIMIT 1";
        $leave_stmt = $db->prepare($leave_query);
        $leave_stmt->bindParam(":leaveid", $data->LEAVEID);
        $leave_stmt->execute();
        
        if ($leave_stmt->rowCount() > 0) {
            $leave_data = $leave_stmt->fetch(PDO::FETCH_ASSOC);
            $remaining_leave = $leave_data['AVELEAVE'] - $leave_data['NODAYS'];
            
            // Update leave status
            $update_query = "UPDATE tblleave SET 
                            LEAVESTATUS = :leavestatus, 
                            ADMINREMARKS = :adminremarks, 
                            DATEPOSTED = :dateposted 
                            WHERE LEAVEID = :leaveid";
            
            $update_stmt = $db->prepare($update_query);
            $dateposted = date('Y-m-d');
            
            $update_stmt->bindParam(":leavestatus", $data->LEAVESTATUS);
            $update_stmt->bindParam(":adminremarks", $data->ADMINREMARKS);
            $update_stmt->bindParam(":dateposted", $dateposted);
            $update_stmt->bindParam(":leaveid", $data->LEAVEID);
            
            if ($update_stmt->execute()) {
                // Update employee leave balance if approved
                if ($data->LEAVESTATUS === 'APPROVED' && $remaining_leave >= 0) {
                    $emp_update_query = "UPDATE tblemployee SET AVELEAVE = :aveleave WHERE EMPID = :empid";
                    $emp_update_stmt = $db->prepare($emp_update_query);
                    $emp_update_stmt->bindParam(":aveleave", $remaining_leave);
                    $emp_update_stmt->bindParam(":empid", $leave_data['EMPID']);
                    $emp_update_stmt->execute();
                }
                
                echo json_encode([
                    "success" => true,
                    "message" => "Leave updated successfully"
                ]);
            } else {
                echo json_encode([
                    "success" => false,
                    "message" => "Failed to update leave"
                ]);
            }
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Leave not found"
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
        "message" => "Only PUT method allowed"
    ]);
}
?>
