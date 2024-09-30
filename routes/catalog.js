const express = require("express");
const router = express.Router();
//导入模块
const book_controller = require("../controllers/bookController");
const author_controller = require("../controllers/authorController");
const genre_controller = require("../controllers/genreController");
const book_instance_controller = require("../controllers/bookinstanceController");

// 路由
// 网站主页
router.get("/", book_controller.index);

// GET 请求创建藏书页面
router.get("/book/create", book_controller.book_create_get);

// POST 请求创建藏书页面
router.post("/book/create", book_controller.book_create_post);

// GET 请求删除藏书页面
router.get("/book/:id/delete", book_controller.book_delete_get);

// POST 请求删除藏书页面
router.post("/book/:id/delete", book_controller.book_delete_post);

// GET 请求更新藏书页面
router.get("/book/:id/update", book_controller.book_update_get);

// POST 请求更新藏书页面
router.post("/book/:id/update", book_controller.book_update_post);

// GET 请求藏书详情页面
router.get("/book/:id", book_controller.book_detail);

// GET 请求藏书列表页面
router.get("/books", book_controller.book_list);




// GET 请求创建作者页面
router.get("/author/create", author_controller.author_create_get);

// POST 请求创建作者页面
router.post("/author/create", author_controller.author_create_post);

// GET 请求删除作者页面
router.get("/author/:id/delete", author_controller.author_delete_get);

// POST 请求删除作者页面
router.post("/author/:id/delete", author_controller.author_delete_post);

// GET 请求更新作者页面
router.get("/author/:id/update", author_controller.author_update_get);

// POST 请求更新作者页面
router.post("/author/:id/update", author_controller.author_update_post)

// GET 请求作者详情页面
router.get("/author/:id", author_controller.author_detail);

// GET 请求作者列表页面
router.get("/authors", author_controller.author_list);




// GET 请求创建类别页面
router.get("/genre/create", genre_controller.genre_create_get);

// POST 请求创建类别页面
router.post("/genre/create", genre_controller.genre_create_post);

// GET 请求删除类别页面
router.get("/genre/:id/delete", genre_controller.genre_delete_get);

// POST 请求删除类别页面
router.post("/genre/:id/delete", genre_controller.genre_delete_post);

// GET 请求更新类别页面
router.get("/genre/:id/update", genre_controller.genre_update_get);

// GET 请求类别详情页面
router.post("/genre/:id/update", genre_controller.genre_update_get);

// GET 请求类别详情页面
router.get("/genre/:id", genre_controller.genre_detail);

// GET 请求类别列表页面
router.get("/genres", genre_controller.genre_list);


// bookinstance图书实例列表 
router.get('/bookinstances', book_instance_controller.bookinstance_list)



// GET 请求创建藏书副本
router.get("/bookinstance/create", book_instance_controller.bookinstance_create_get);

// POST 请求创建藏书副本
router.post("/bookinstance/create", book_instance_controller.bookinstance_create_post);

// GET request to delete BookInstance.
router.get(
    "/bookinstance/:id/delete",
    book_instance_controller.bookinstance_delete_get
);

// POST request to delete BookInstance.
router.post(
    "/bookinstance/:id/delete",
    book_instance_controller.bookinstance_delete_post
);

// GET request to update BookInstance.
router.get(
    "/bookinstance/:id/update",
    book_instance_controller.bookinstance_update_get
);

// POST request to update BookInstance.
router.post(
    "/bookinstance/:id/update",
    book_instance_controller.bookinstance_update_post
);

// GET request for one BookInstance.
router.get("/bookinstance/:id", book_instance_controller.bookinstance_detail);

module.exports = router;
