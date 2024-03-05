package com.server.cinema.movie.service;

import java.util.List;

import com.server.cinema.movie.dao.MovieDAO;
import com.server.cinema.movie.entity.Movie;
import com.server.cinema.movie.exception.MovieNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public final class MovieService {

    private final MovieDAO movieDAO;

    @Autowired
    public MovieService(final MovieDAO movieDAO) {
        this.movieDAO = movieDAO;
    }

    public void addMovie(final Movie movie) {
        movieDAO.addMovie(movie);
    }

    public Movie getMovieById(final int id) {
        return movieDAO
                .selectMovieById(id)
                .orElseThrow(() -> new MovieNotFoundException(String.format("Movie with id %d does not exist.", id)));
    }

    public List<Movie> getAllMovies() {
        return movieDAO.selectAllMovies();
    }

    public List<Movie> searchMovies(final String searchQuery) {
        return movieDAO.searchMovies(searchQuery);
    }
}
