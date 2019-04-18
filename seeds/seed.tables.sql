BEGIN;

TRUNCATE
  users,
  projects,
  user_projects,
  requests
  RESTART IDENTITY CASCADE;

INSERT INTO users (first_name, last_name, email, avatar, password, about)
VALUES 
  (
    'Michael', 
    'Corleone', 
    'mc@gmail.com', 
    'https://images-na.ssl-images-amazon.com/images/I/51U4eey5TwL.jpg', 
    '$2a$12$IfBv1jfYiM2ZRrQEpteYdue8cwHsf2AuqcLmaC0ZXeX/EvGewEOL2',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  ),
  (
    'John', 
    'Doe', 
    'jd@gmail.com', 
    'https://s.hdnux.com/photos/67/37/70/14548493/5/920x920.jpg', 
    '$2a$12$r8VstcJ4kRGTf4ET8BOXsOGe74Dmx4mD7k3V9cUkaiRJJfFTx.5Ua',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  ),
  (
    'Jane', 
    'Smith', 
    'js@gmail.com', 
    'https://i.guim.co.uk/img/static/sys-images/Guardian/Pix/pictures/2015/11/11/1447256093904/Natalie-Dormergoin-009.jpg?width=300&quality=85&auto=format&fit=max&s=dd10398f631067df9dbd7332ec82badf', 
    '$2a$12$ih..MMyEY28hHpBmMrWCk.w88QxiuTw07SPQ/T4I9Ek3BxEBvsxVG',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  ),
  (
    'Jon',
    'Snow',
    'jonsnow@ironthrone.com',
    'https://akm-img-a-in.tosshub.com/indiatoday/images/story/201903/kit.jpeg?lpOiussrW2pB6TdhoGSjS_PBn7OQE6zD',
    '$2a$12$IfBv1jfYiM2ZRrQEpteYdue8cwHsf2AuqcLmaC0ZXeX/EvGewEOL2',
    'The King in the North'
  );

INSERT INTO projects (title, description, img, leader_id)
VALUES
  (
    'React + Node | FullStack App',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'https://facebook.github.io/create-react-app/img/logo-og.png',
    1
  ),
  (
    'React Native app',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'https://instabug.com/blog/wp-content/uploads/2018/03/Featured.jpg',
    2
  ),
  (
    'Wordpress website design',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'https://udemy-images.udemy.com/course/750x422/1400228_f27e.jpg',
    3
  ),
  (
    'Unity',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'https://cdnp2.stackassets.com/04865d24b8e51cb69f980ac85f82671d15b911fe/store/opt/596/298/9b1800573b3eca4e65c1b9311f8606e1c1077a94303959f3cba47b4bd4b2/f346a5ad04ca3ad293b162724ddeed7a5ab8074c_main_hero_image.jpg',
    3
  ),
  (
    'Awesome Ruby on Rails project',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'https://community-cdn-digitalocean-com.global.ssl.fastly.net/assets/tutorials/images/large/ruby-on-rails.jpg?1534433819',
    3
  ),
  (
    'jQuery website',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'https://cdn-images-1.medium.com/max/1200/0*s1Goua9K1MuNuapv.jpg',
    3
  ),
  (
    'Phyton + Django',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'https://www.anychart.com/_design/img/upload/integration/python-django-mysql-sample.png',
    3
  ),
  (
    'ASP .NET',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'https://exceptionnotfound.net/content/images/2018/06/asp-net-mvc.jpg',
    3
  ),
  (
    'Vanila HTML,CSS,JS',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'https://www.planet-source-code.com/vb/2010Redesign/images/LangugeHomePages/HTML5_CSS_JavaScript.png',
    3
  ),
  (
    'Awesome Angular',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'https://www.sitepen.com/blog/wp-content/uploads/2017/09/blog.jpg',
    3
  ),
  (
    'Web App | Vue.js',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'https://rsp3k1pe7ulhpgnt-zippykid.netdna-ssl.com/wp-content/uploads/2017/03/vue.jpg',
    1
  ),
  (
    'Defend the North',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'https://www.thesun.co.uk/wp-content/uploads/2019/04/NINTCHDBPICT0004824116672.jpg?strip=all&w=871&quality=100',
    4
  );

INSERT INTO user_projects (user_id, role, project_id, title)
VALUES
  (4, 'leader', 12, 'Team lead'),
  (4, 'contributor', 1, 'Software engineer'),
  (1, 'leader', 1, 'Project lead'),
  (1, 'leader', 11, 'Project lead'),
  (1, 'contributor', 2, 'UI designer'),
  (2, 'leader', 2, 'Project lead'),
  (2, 'contributor', 3, 'Frontend developer'),
  (3, 'leader', 3, 'Project lead'),
  (3, 'leader', 4, 'Project lead'),
  (3, 'leader', 5, 'Project lead'),
  (3, 'leader', 6, 'Project lead'),
  (3, 'leader', 7, 'Project lead'),
  (3, 'leader', 8, 'Project lead'),
  (3, 'leader', 9, 'Project lead'),
  (3, 'leader', 10, 'Project lead'),
  (3, 'contributor', 2, 'Backend developer');

INSERT INTO requests (sender_id, project_id, recipient_id)
  VALUES
    (1, 12, 4),
    (2, 12, 4),
    (3, 12, 4),
    (1, 4, 3),
    (2, 11, 1),
    (2, 1, 1);

COMMIT;