BEGIN;

TRUNCATE
  users,
  notifications,
  projects,
  user_projects
  RESTART IDENTITY CASCADE;

INSERT INTO users (first_name, last_name, email, avatar, password)
VALUES 
  (
    'Oleg', 
    'Kan', 
    'olegkan@gmail.com', 
    'https://www.telegraph.co.uk/content/dam/health-fitness/2018/10/10/TELEMMGLPICT000137602298_trans_NvBQzQNjv4Bq6L3Bx11x18zbsv4k04trOLQwDzZ7lnsLeYSCKv0SGGE.jpeg?imwidth=450', 
    '$2a$12$IfBv1jfYiM2ZRrQEpteYdue8cwHsf2AuqcLmaC0ZXeX/EvGewEOL2'
  ),
  (
    'John', 
    'Doe', 
    'johndoe@gmail.com', 
    'https://s.hdnux.com/photos/67/37/70/14548493/5/920x920.jpg', 
    '$2a$12$r8VstcJ4kRGTf4ET8BOXsOGe74Dmx4mD7k3V9cUkaiRJJfFTx.5Ua'
  ),
  (
    'Jane', 
    'Smith', 
    'janesmith@gmail.com', 
    'https://i.guim.co.uk/img/static/sys-images/Guardian/Pix/pictures/2015/11/11/1447256093904/Natalie-Dormergoin-009.jpg?width=300&quality=85&auto=format&fit=max&s=dd10398f631067df9dbd7332ec82badf', 
    '$2a$12$ih..MMyEY28hHpBmMrWCk.w88QxiuTw07SPQ/T4I9Ek3BxEBvsxVG'
  );

INSERT INTO notifications (id, text, user_id) 
VALUES
  (1, 'New message from Putin', 2),
  (2, 'New request from Donald', 1),
  (3, 'Your request was accepted by Kim', 3);

INSERT INTO projects (title, description, img)
VALUES
  (
    'React + Node | FullStack App',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'https://facebook.github.io/create-react-app/img/logo-og.png'
  ),
  (
    'React Native app',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'https://instabug.com/blog/wp-content/uploads/2018/03/Featured.jpg'
  ),
  (
    'Wordpress website design',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'https://udemy-images.udemy.com/course/750x422/1400228_f27e.jpg'
  ),
  (
    'Unity',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'https://cdnp2.stackassets.com/04865d24b8e51cb69f980ac85f82671d15b911fe/store/opt/596/298/9b1800573b3eca4e65c1b9311f8606e1c1077a94303959f3cba47b4bd4b2/f346a5ad04ca3ad293b162724ddeed7a5ab8074c_main_hero_image.jpg'
  ),
  (
    'Awesome Ruby on Rails project',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'https://community-cdn-digitalocean-com.global.ssl.fastly.net/assets/tutorials/images/large/ruby-on-rails.jpg?1534433819'
  ),
  (
    'jQuery website',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'https://cdn-images-1.medium.com/max/1200/0*s1Goua9K1MuNuapv.jpg'
  ),
  (
    'Phyton + Django',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'https://www.anychart.com/_design/img/upload/integration/python-django-mysql-sample.png'
  ),
  (
    'ASP .NET',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'https://exceptionnotfound.net/content/images/2018/06/asp-net-mvc.jpg'
  ),
  (
    'Vanila HTML,CSS,JS',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'https://www.planet-source-code.com/vb/2010Redesign/images/LangugeHomePages/HTML5_CSS_JavaScript.png'
  ),
  (
    'Awesome Angular',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'https://www.sitepen.com/blog/wp-content/uploads/2017/09/blog.jpg'
  ),
  (
    'Web App | Vue.js',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'https://rsp3k1pe7ulhpgnt-zippykid.netdna-ssl.com/wp-content/uploads/2017/03/vue.jpg'
  );

INSERT INTO user_projects (user_id, role, project_id)
VALUES
  (1, '1', 1),
  (1, '1', 2),
  (2, '2', 1),
  (2, '1', 3),
  (3, '2', 1),
  (3, '2', 3);

COMMIT;