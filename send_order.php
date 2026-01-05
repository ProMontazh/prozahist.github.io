<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = $_POST["name"];
    $email = $_POST["email"];
    $phone = $_POST["phone"];
    $cart = $_POST["cart"];

    // Настройка получателя и заголовков
    $to = "prozakhyst@ukr.net";  // Замените на вашу почту
    $subject = "Новый заказ";
    $headers = "From: no-reply@yourdomain.com\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";

    // Форматирование тела письма
    $message = "<h1>Новый заказ</h1>";
    $message .= "<p>Имя: $name</p>";
    $message .= "<p>Email: $email</p>";
    $message .= "<p>Телефон: $phone</p>";
    $message .= "<h2>Содержимое корзины:</h2><ul>";

    foreach (json_decode($cart, true) as $item) {
        $message .= "<li>" . $item["name"] . " — Количество: " . $item["quantity"] . ", Цена: " . $item["price"] . " грн</li>";
    }
    $message .= "</ul>";

    // Отправка письма
    if (mail($to, $subject, $message, $headers)) {
        echo "Дякуемо за замовлення, заказ відправлен успішно!";
    } else {
        echo "Помилка при відправленні замовлення.";
    }
}
?>

