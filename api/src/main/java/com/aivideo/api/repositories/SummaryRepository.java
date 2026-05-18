package com.aivideo.api.repositories;

import com.aivideo.api.models.Summary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SummaryRepository extends JpaRepository<Summary, UUID> {
    Optional<Summary> findByVideoId(UUID videoId);
}
