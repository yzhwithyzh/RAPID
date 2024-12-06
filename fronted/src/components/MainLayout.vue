<template>
    <!-- <div class="preloader">
    <div class="loaderlogo">
        <img src="statics/images/advanced.png">
        <p>正在加载... 请稍等</p>
        <div class="dashedborder"></div>
    </div>
</div> -->

<header class="rundal-header fixed-top animation header-light" style="background-color: white;">
    <div class="container-fluid container">
        <div class="menu-header ">
            <div class="menu-logo">
                <div class="website-logo">
                    <a href="/" class="brandlogo">
                        <img src="/statics/images/advanced.jpg" style="width: 200px;" alt="logo" class="light">
                        <img src="/statics/images/advanced.jpg" style="width: 200px;" alt="logo" class="dark">
                    </a>
                    
                </div>
            </div>
            <div class="rundal-nav">
                <nav class="navbar navbar-expand-lg chead">
                    <div class="container-fluid">
                        <div class="offcanvas offcanvas-start-lg" tabindex="-1" id="offcanvasmenu-sw"
                             aria-labelledby="offcanvasExampleLabel">
                            <!--<div class="offcanvas-header d-flex d-lg-none">
                                <div class="offcanvas-title" id="offcanvasExampleLabel"><img
                                        src="statics/images/logo-dark.svg"
                                        alt="logo"
                                        class="sidebarlogo"></div>
                                <a href="javascript:void(0)" class="text-reset p-0" data-bs-dismiss="offcanvas"
                                   aria-label="close">✖︎</a>
                            </div>-->
                            <div class="offcanvas-body p-lg-0">
                                <ul class="navbar-nav">
                                    <li class="nav-item dropdown sw-megamenu">
                                        <a class="nav-link" href="/" data-bs-auto-close="outside">Home</a>
                                    </li>
                                    <!--<li class="nav-item ">
                                        <a class="nav-link" href="faq">FAQ</a>
                                    </li>-->
                                    <!-- {% if not user %} -->
                                    <li class="nav-item ">
                                        <HeaderUser/>
                                    </li>

                                    <!-- {% else %}
                                    <li class="nav-item dropdown">
                                        <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown" data-bs-auto-close="outside">用户中心</a>
                                        <ul class="dropdown-menu signledropdown">
                                            <li><a class="dd-item" href="#"> {{user.email}}</a></li>
                                            <li><a class="dd-item logout" href="#"> 退出</a></li>
                                        </ul>
                                    </li>
                                    {% endif %} -->
                                </ul>
                                
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
            <!--<div class="rundal-nav-cta">
                <ul class="sw-menu-sw-set">
                    <li><a href="/logon" class="r-g-btn r-g-btn btn-head"> 登录 </a></li>
                    <li class="sidebarmenuicon">
                        <a href="#" data-bs-toggle="offcanvas" data-bs-target="#offcanvasmenu-sw"
                           aria-controls="offcanvasmenu-sw"><i
                                class="fa-solid fa-bars-staggered"></i></a>
                    </li>
                </ul>
            </div>-->
        </div>
    </div>
</header>

<router-view></router-view>
<footer class="footerdiv" style="padding-top: 0px;z-index:200">
    
    
    <div class="footer-end border-top-dashed">
        <div class="container">
            <div class="row">
                <div class="col-lg-5 col-md-12">
                    <div class="ft-copyright">
                        <p> Copyright © HKBU <a href=""></a></p>
                    </div>
                </div>
                <div class="col-lg-7 col-md-12">
                    <div class="ft-linkz link-hover">
                        <img src="/statics/images/logo3@2x.4547a78.jpg" alt="logo" style="height: 34px;">
                       
                    </div>
                </div>
            </div>
        </div>
    </div>
</footer>


<div class="progress-wrap">
    <svg class="progress-circle svg-content" width="100%" height="100%" viewBox="-1 -1 102 102">
        <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"/>
    </svg>
</div>






    
  </template>
  
  <script setup>
  import HeaderUser from "./header-user.vue";
//   const imageSrc = require('@/statics/images/advanced.png');
//   return {
//     imageSrc
//   };
  </script>
  
  <style scoped>
    .footer-end {
        padding: 10px 0;
    }
    .preloader {
        background-color: white;
    }
    .nav-item{
        display: grid;
        align-items: center; /* 垂直居中 */
       
    }
  </style>