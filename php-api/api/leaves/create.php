
<?php
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, "Method not allowed");
}

$data = json_decode(file_get_contents("php://input"));

if (empty($data->empId) || empty($data->leaveTypeId) || empty($data->dateStart) || empty($data->dateEnd)) {
    sendResponse(false, "Employee ID, leave type, start date, and end date are required");
}

try {
    // Generate new leave ID
    $query = "SELECT MAX(LEAVEID) as max_id FROM tblleave";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $newLeaveId = ($result['max_id'] ?? 0) + 1;
    
    // Calculate days of leave
    $startDate = new DateTime($data->dateStart);
    $endDate = new DateTime($data->dateEnd);
    $interval = $startDate->diff($endDate);
    $daysOfLeave = $interval->days + 1;
    
    $query = "INSERT INTO tblleave (
                LEAVEID, EMPID, LEAVETYPEID, DESCRIBEDLEAVE, DAYSOFLEAVE, 
                DATESTART, DATEEND, DATEAPPLY, STATUS, REASON
              ) VALUES (
                :leaveId, :empId, :leaveTypeId, :describedLeave, :daysOfLeave, 
                :dateStart, :dateEnd, :dateApply, :status, :reason
              )";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':leaveId', $newLeaveId);
    $stmt->bindParam(':empId', $data->empId);
    $stmt->bindParam(':leaveTypeId', $data->leaveTypeId);
    $stmt->bindParam(':describedLeave', $data->describedLeave ?? '');
    $stmt->bindParam(':daysOfLeave', $daysOfLeave);
    $stmt->bindParam(':dateStart', $data->dateStart);
    $stmt->bindParam(':dateEnd', $data->dateEnd);
    $stmt->bindParam(':dateApply', date('Y-m-d'));
    $stmt->bindParam(':status', $data->status ?? 'Pending');
    $stmt->bindParam(':reason', $data->reason ?? '');
    
    if ($stmt->execute()) {
        sendResponse(true, "Leave application created successfully", array("leaveId" => $newLeaveId));
    } else {
        sendResponse(false, "Failed to create leave application");
    }
    
} catch (Exception $e) {
    sendResponse(false, "Error creating leave application: " . $e->getMessage());
}
?>
