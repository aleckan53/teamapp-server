
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('projects').del()
    .then(function () {
      // Inserts seed entries
      return knex('projects').insert([
        {
          title: "React + Node | FullStack App",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          img: "https://facebook.github.io/create-react-app/img/logo-og.png",      
        },
        {
          title: "React Native app",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          img: "https://instabug.com/blog/wp-content/uploads/2018/03/Featured.jpg"      
        },
        {
          title: "Wordpress website design",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          img: "https://udemy-images.udemy.com/course/750x422/1400228_f27e.jpg"      
        },
        {
          title: "Unity",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          img: "https://cdnp2.stackassets.com/04865d24b8e51cb69f980ac85f82671d15b911fe/store/opt/596/298/9b1800573b3eca4e65c1b9311f8606e1c1077a94303959f3cba47b4bd4b2/f346a5ad04ca3ad293b162724ddeed7a5ab8074c_main_hero_image.jpg"      
        },
        {
          title: "Awesome Ruby on Rails project",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          img: "https://community-cdn-digitalocean-com.global.ssl.fastly.net/assets/tutorials/images/large/ruby-on-rails.jpg?1534433819"      
        },
        {
          title: "jQuery website",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          img: "https://cdn-images-1.medium.com/max/1200/0*s1Goua9K1MuNuapv.jpg"      
        },
        {
          title: "Phyton + Django",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          img: "https://www.anychart.com/_design/img/upload/integration/python-django-mysql-sample.png"      
        },
        {
          title: "ASP .NET",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          img: "https://exceptionnotfound.net/content/images/2018/06/asp-net-mvc.jpg"      
        },
        {
          title: "Vanila HTML,CSS,JS",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          img: "https://www.planet-source-code.com/vb/2010Redesign/images/LangugeHomePages/HTML5_CSS_JavaScript.png"      
        },
        {
          title: "Awesome Angular",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          img: "https://www.sitepen.com/blog/wp-content/uploads/2017/09/blog.jpg"      
        },
        {
          title: "Web App | Vue.js",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          img: "https://rsp3k1pe7ulhpgnt-zippykid.netdna-ssl.com/wp-content/uploads/2017/03/vue.jpg"      
        },
      ]);
    });
};
