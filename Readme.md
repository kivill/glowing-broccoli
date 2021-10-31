<h4>Реализованная функциональность</h4>
<ul>
    <li>Авторизация</li>
    <li>Разделение прав (admin, user)</li>
    <li>Карта (обращения, новые постройки)</li>
    <li>Демонтсрация предполагаемого места для строительства</li>
</ul>

<h4>Особенность проекта в следующем:</h4>
<ul>
 <li>1</li>
 <li>2</li>
 <li>3</li>
 </ul>
<h4>Основной стек технологий:</h4>
<ul>
    <li>LNMN.</li>
	<li>HTML, SCSS, JavaScript, TypeScript.</li>
	<li>NodeJS 14</li>
	<li>NestJS.</li>
    <li>Vue3 (Quasar)</li>
	<li>LESS, SASS, PostCSS.</li>
	<li>Webpack, Babel.</li>
	<li>Git.</li>
	<li>Docker Compose.</li>  
 </ul>
<h4>Демо</h4>
<p>Реквизиты админа: email: <b>admin@mail.com</b>, пароль: <b>2665640</b></p>
<p>Реквизиты работника муниципалитета: email: <b>municipality@mail.com</b>, пароль: <b>2665640</b></p>
<p>Реквизиты тестового пользователя: email: <b>user@mail.com</b>, пароль: <b>2665640</b></p>


СРЕДА ЗАПУСКА
------------
1) развертывание сервиса производится на debian-like linux (Ubuntu 20.04);
2) требуется установленный docker и docker compose;


УСТАНОВКА
------------
### Установка docker и docker compose

Выполните 
~~~
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo \
  "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io
sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker 
~~~

Запуск
------------
### Запуск проекта с помощью docker compose

Выполните 
~~~
git clone https://github.com/kivill/bug-free-octo-system.git 
cd ./bug-free-octo-system
docker-compose -f "docker-compose.yml" up -d --build
~~~

РАЗРАБОТЧИКИ

<h4>Поздеев Кирилл fullstack https://t.me/kivill </h4>
<h4>Кудреватых Виталий frontend https://t.me/vitkud1 </h4>
