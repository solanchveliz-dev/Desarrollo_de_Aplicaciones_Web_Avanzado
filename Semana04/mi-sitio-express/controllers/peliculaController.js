const peliculas = [];

const listarPeliculas = (req, res) => {
	res.render("peliculas", {
		title: "Catálogo de películas y series",
		peliculas
	});
};

const guardarPelicula = (req, res) => {
	const { titulo, genero, anio, plataforma, estado } = req.body;

	peliculas.push({
		titulo,
		genero,
		anio,
		plataforma,
		estado
	});

	res.redirect("/peliculas");
};

module.exports = {
	listarPeliculas,
	guardarPelicula
};
