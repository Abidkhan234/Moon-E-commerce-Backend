const getProduct = (req, res) => {

    const { email, userName } = req.userData;

    res.status(200).send({ status: 200, message: "Product Route Working", userEmail: email, userName })
}

export { getProduct }