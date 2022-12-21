class HomeController {
  index(req, res) {
    res.send("SERVER ONLINE");
  }
}

export default new HomeController();
