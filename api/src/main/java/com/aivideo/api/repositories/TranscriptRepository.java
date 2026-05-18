package com.aivideo.api.repositories;

import com.aivideo.api.models.Transcript;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TranscriptRepository extends JpaRepository<Transcript, UUID> {
    Optional<Transcript> findByVideoId(UUID videoId);
}
