<?php

require_once '../utils/headers.php';

require_once '../utils/error-reporting.php';

require_once '../utils/get-settings.php';

require_once '../utils/init-pdo.php';

$settings_a = getSettings();

$pdo_o = initPdo($settings_a);

switch ($_SERVER['REQUEST_METHOD']) {

    case 'GET':

        $whereClauses_a = [];

        $params_a = [];

        $sql_s = 'SELECT id';

        if(!empty($_GET['fields'])) {

            $sql_s .= ',' . $_GET['fields'] . ' ';
        }

        $sql_s .= 'FROM hs4u2_member';

        if(!empty($_GET['frombirthdate'])) {

            $frombirthdate_s = $_GET['frombirthdate'];

            array_push($whereClauses_a, 'birthdate >= :frombirthdate');

            $params_a['frombirthdate'] = $frombirthdate_s;
        }

        if(!empty($_GET['tobirthdate'])) {

            $tobirthdate_s = $_GET['tobirthdate'];

            array_push($whereClauses_a, 'birthdate <= :tobirthdate');

            $params_a['tobirthdate'] = $tobirthdate_s;
        }

        if(!empty($_GET['country'])) {

            $country_s = $_GET['country'];

            array_push($whereClauses_a, 'country = :country');

            $params_a['country'] = $country_s;
        }

        if(!empty($_GET['mygender'])) {

            $myGender_s = $_GET['mygender'];

            array_push($whereClauses_a, 'genderseek = :genderseek');

            $params_a['genderseek'] = $myGender_s;
        }

        if(!empty($_GET['theirgender'])) {

            $theirGender_s = $_GET['theirgender'];

            array_push($whereClauses_a, 'gender = :gender');

            $params_a['gender'] = $theirGender_s;
        }

        if(!empty($whereClauses_a)) {

            $sql_s .= ' WHERE ' . implode(' AND ', $whereClauses_a);
        }

        //echo $sql_s; exit;

        $stmt_o = $pdo_o->prepare($sql_s);

        $stmt_o->execute($params_a);

        $response_a = [];

        while($row_o = $stmt_o->fetch()) {
            array_push($response_a, $row_o);
        }

        echo json_encode($response_a, JSON_UNESCAPED_UNICODE);
        
        break;

    case 'POST':

        require_once '../utils/get-payload.php';

        $asArray_b = true;

        $payload_a = getPayload($asArray_b);

        $sql_s = "INSERT INTO hs4u2_member (firstname, gender, email, password) VALUES (:firstname, :gender, :email, :password)";

        $stmt_o = $pdo_o->prepare($sql_s);

        $stmt_o->execute($payload_a);

        $result_o = new stdClass();

        $result_o->status = 'ok';

        $data_o = new stdClass();

        $data_o->id = $pdo_o->lastInsertId();

        $result_o->data = $data_o;

        echo json_encode($result_o, JSON_UNESCAPED_UNICODE);

        break;

    case 'PUT': 

        require_once '../utils/get-payload.php';

        $asArray_b = true;

        $payload_a = getPayload($asArray_b);

        $sql_s = "UPDATE hs4u2_member SET agefromseek=:agefromseek, agetoseek=:agetoseek, alcohol=:alcohol, children=:children, countryseek=:countryseek, firstname=:firstname, genderseek=:genderseek, lastname=:lastname, marital=:marital, partnerpreferences=:partnerpreferences, physique=:physique, country=:country, city=:city, birthdate=:birthdate, eyecolor=:eyecolor, gender=:gender, haircolor=:haircolor, height=:height, email=:email, maindescription=:maindescription, profession=:profession, smoke=:smoke, wantchildren=:wantchildren, weight=:weight WHERE id=:id";

        $stmt_o = $pdo_o->prepare($sql_s);

        $stmt_o->execute($payload_a);

        $result_o = new stdClass();

        $result_o->status = 'ok';

        echo json_encode($result_o, JSON_UNESCAPED_UNICODE);

        break;

    default: break;
}

function get() {

    $result_o = new stdClass();

    $result_o->{'result'} = 'ok';
    
    $result_o->{'data'} = json_decode(file_get_contents('members.json'));
    
    echo json_encode($result_o, JSON_UNESCAPED_UNICODE);
}

function post() {
    
    $payload_s = file_get_contents('php://input');

    $member_o = json_decode($payload_s);

    $member_o->{'id'} = uuid();

    $members_ao = json_decode(file_get_contents('../members/members.json'));

    array_push($members_ao, $member_o);

    $members_s = json_encode($members_ao, JSON_UNESCAPED_UNICODE);

    file_put_contents('./members.json', $members_s);

    $response_o = new stdClass();

    $data_o = new stdClass();

    $response_o->{'status'} = 'ok';

    $response_o->{'data'} = $data_o;

    echo json_encode($response_o, JSON_UNESCAPED_UNICODE); 
}

function uuid($lenght = 10) {

    if (function_exists('random_bytes')) {

        $bytes = random_bytes(ceil($lenght / 2));

    } elseif (function_exists('openssl_random_pseudo_bytes')) {

        $bytes = openssl_random_pseudo_bytes(ceil($lenght / 2));

    } else {

        throw new Exception('no cryptographically secure random function available');
    }

    return substr(bin2hex($bytes), 0, $lenght);
}



