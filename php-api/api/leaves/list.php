
<?php
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

try {
    $query = "SELECT l.LEAVEID, l.EMPID, l.DESCRIBEDLEAVE, l.DAYSOFLEAVE, l.DATESTART, 
                     l.DATEEND, l.DATEAPPLY, l.STATUS, l.REASON, l.LEAVETYPEID,
                     e.FNAME, e.LNAME, e.MNAME, e.POSITION,
                     lt.LEAVETYPE, lt.LEAVEDETAILS,
                     c.COMPANYNAME, d.DEPARTMENT
              FROM tblleave l 
              LEFT JOIN tblemployees e ON l.EMPID = e.EMPID 
              LEFT JOIN tblleavetype lt ON l.LEAVETYPEID = lt.LEAVETYPEID 
              LEFT JOIN tblcompany c ON e.COMPANYID = c.COMPANYID 
              LEFT JOIN tbldepartment d ON e.DEPARTMENTID = d.DEPARTMENTID 
              ORDER BY l.DATEAPPLY DESC";
    
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $leaves = array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $leaves[] = array(
            "id" => $row['LEAVEID'],
            "empId" => $row['EMPID'],
            "employeeName" => trim($row['FNAME'] . ' ' . $row['MNAME'] . ' ' . $row['LNAME']),
            "position" => $row['POSITION'],
            "companyName" => $row['COMPANYNAME'],
            "departmentName" => $row['DEPARTMENT'],
            "leaveTypeId" => $row['LEAVETYPEID'],
            "leaveType" => $row['LEAVETYPE'],
            "leaveDetails" => $row['LEAVEDETAILS'],
            "describedLeave" => $row['DESCRIBEDLEAVE'],
            "daysOfLeave" => $row['DAYSOFLEAVE'],
            "dateStart" => $row['DATESTART'],
            "dateEnd" => $row['DATEEND'],
            "dateApply" => $row['DATEAPPLY'],
            "status" => $row['STATUS'],
            "reason" => $row['REASON']
        );
    }
    
    sendResponse(true, "Leaves retrieved successfully", $leaves);
    
} catch (Exception $e) {
    sendResponse(false, "Error retrieving leaves: " . $e->getMessage());
}
?>
