<?php
session_start();
$time_limit = 60;
if (!isset($_SESSION['visit_count'])) {
    $_SESSION['visit_count'] = 0;
    $_SESSION['start_time'] = time();
}
$_SESSION['visit_count']++;
$current_time = time();
$elapsed_time = $current_time - $_SESSION['start_time'];
if ($elapsed_time > $time_limit) {
    $_SESSION['visit_count'] = 1;
    $_SESSION['start_time'] = $current_time;
}
if ($_SESSION['visit_count'] > 5) {
    $ip_info = json_decode(file_get_contents('https://ipinfo.io/json'), true);
    $ip = $ip_info['ip'] ?? 'Unknown IP';
    $city = $ip_info['region'] ?? 'Unknown City';
    $country = $ip_info['country'] ?? 'Unknown Country';
    $message = "⚠️ Cảnh Báo: có người dùng truy cập quá nhiều lần!\n";
    $message .= "IP: $ip\n";
    $message .= "City: $city\n";
    $message .= "Country: $country\n";
    $url = "https://api.telegram.org/bot7567490878:AAEf8MBFX_BKNlnmtxIG1lcHdmp52gzsZBE/sendMessage?chat_id=6354872265&text=" . urlencode($message);
    file_get_contents($url);
    $_SESSION['visit_count'] = 1;
    $_SESSION['start_time'] = $current_time;
}
?>
