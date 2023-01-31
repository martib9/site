<?php
  if (!isset($_POST['agreement']) || !$_POST['agreement']) {
    die('Check the box');
  }

  $to = $_POST['email'];
  $subject = 'You have been rick rolled';
  $message = 'You have been rick rolled';
  $headers = 'From: noreply@martib.co' . "\r\n" .
             'MIME-Version: 1.0' . "\r\n" .
             'Content-Type: text/html; charset=UTF-8';
  mail($to, $subject, $message, $headers);
?>
