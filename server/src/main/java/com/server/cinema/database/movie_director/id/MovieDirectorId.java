package com.server.cinema.database.movie_director.id;

import java.io.Serializable;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public final class MovieDirectorId implements Serializable {
    private int movieId;
    private int directorId;
}
