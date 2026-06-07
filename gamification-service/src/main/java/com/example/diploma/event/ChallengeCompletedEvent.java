package com.example.diploma.event;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ChallengeCompletedEvent {
    private Long challengeId;
    private Long memberId;
    private Integer rewardPoints;
    private Object completionTime;

    public Integer getEffectivePoints() {
        return rewardPoints != null ? rewardPoints : 0;
    }
}