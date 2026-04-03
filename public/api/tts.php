<?php
// Referer check: only allow requests from our own domain
$allowedReferer = 'https://b4ch.altervista.org';
$referer = $_SERVER['HTTP_REFERER'] ?? '';

if (strpos($referer, $allowedReferer) !== 0) {
    http_response_code(403);
    echo json_encode(['error' => 'Forbidden']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Read API key from file in the same directory
$apiKeyFile = __DIR__ . '/.tts_api_key';
if (!file_exists($apiKeyFile)) {
    http_response_code(500);
    echo json_encode(['error' => 'Server configuration error']);
    exit;
}
$API_KEY = trim(file_get_contents($apiKeyFile));
$VOICE_ID = 'JBFqnCBsd6RMkjVDRZzb';

// Rate limiting: max 100 requests per day
$counterFile = sys_get_temp_dir() . '/numbah_tts_counter';
$today = date('Y-m-d');

// Read counter
$contents = @file_get_contents($counterFile);
$data = $contents ? json_decode($contents, true) : null;
$requests = ($data && isset($data['date']) && $data['date'] === $today) ? (int)$data['count'] : 0;

if ($requests >= 100) {
    http_response_code(429);
    echo json_encode(['error' => 'Daily limit reached']);
    exit;
}

// Forward request to 11Labs
$input = json_decode(file_get_contents('php://input'), true);
if (!$input || !isset($input['text'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing text field']);
    exit;
}

$ch = curl_init("https://api.elevenlabs.io/v1/text-to-speech/$VOICE_ID");
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'xi-api-key: ' . $API_KEY,
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'text' => $input['text'],
    'model_id' => 'eleven_multilingual_v2',
    'language_code' => 'ru',
]));

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    http_response_code($httpCode);
    echo $response;
    exit;
}

// Increment counter (atomic write with LOCK_EX)
file_put_contents($counterFile, json_encode(['date' => $today, 'count' => $requests + 1]), LOCK_EX);

// Return audio blob
header('Content-Type: audio/mpeg');
header('Content-Length: ' . strlen($response));
echo $response;
