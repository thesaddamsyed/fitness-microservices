package com.fitness.aiservice.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitness.aiservice.model.Activity;
import com.fitness.aiservice.model.Recommendation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityAiService {

    private final GeminiService geminiService;

    public Recommendation generateRecommendation(Activity activity) {
        String prompt = createPromptForActivity(activity);
        String response = geminiService.getAnswer(prompt);
        return processAiResponse(activity, response);
    }

    private Recommendation processAiResponse(Activity activity, String aiResponse) {

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(aiResponse);
            JsonNode textNode = rootNode.path("candidates").get(0).path("content").path("parts").get(0).path("text");
            String jsonContent = textNode.asText().replaceAll("```json\\n", "").replaceAll("\\n```", "").trim();
            JsonNode parsedJson = objectMapper.readTree(jsonContent);
            JsonNode analysisNode = parsedJson.path("analysis");
            StringBuilder fullAnalysis = new StringBuilder();
            addAnalysisSection(fullAnalysis, analysisNode, "overall", "Overall: ");
            addAnalysisSection(fullAnalysis, analysisNode, "pace", "Pace: ");
            addAnalysisSection(fullAnalysis, analysisNode, "heartRate", "Heart Rate: ");
            addAnalysisSection(fullAnalysis, analysisNode, "caloriesBurned", "Calories: ");

            List<String> improvements = extractImprovements(parsedJson.path("improvements"));
            List<String> suggestions = extractSuggestions(parsedJson.path("suggestions"));
            List<String> safetyMeasures = extractSafetyInstructions(parsedJson.path("safety"));

            return Recommendation.builder()
                    .activityId(activity.getId())
                    .userId(activity.getUserId())
                    .activityType(activity.getType())
                    .recommendation(fullAnalysis.toString().trim())
                    .improvements(improvements)
                    .suggestions(suggestions)
                    .safetyMeasures(safetyMeasures)
                    .createdAt(LocalDateTime.now())
                    .build();

        } catch (Exception e) {
            log.error("Error processing AI response: {}", e.getMessage());
            e.printStackTrace();
            return Recommendation.builder()
                    .activityId(activity.getId())
                    .userId(activity.getUserId())
                    .activityType(activity.getType())
                    .recommendation("Error processing AI response. Please try again later.")
                    .improvements(Collections.singletonList("No specific improvements provided"))
                    .suggestions(Collections.singletonList("No specific suggestions provided"))
                    .safetyMeasures(Collections.singletonList("No specific safety measures provided"))
                    .createdAt(LocalDateTime.now())
                    .build();
        }

    }

    private List<String> extractImprovements(JsonNode node) {
        List<String> improvements = new ArrayList<>();

        if (node.isArray()) {
            node.forEach(improvement -> {
                String area = improvement.path("area").asText();
                String recommendation = improvement.path("recommendation").asText();
                improvements.add(String.format("%s: %s", area, recommendation));
            });
        }

        return improvements.isEmpty() ? Collections.singletonList("No specific improvements provided") : improvements;

    }

    private List<String> extractSuggestions(JsonNode node) {
        List<String> suggestions = new ArrayList<>();

        if (node.isArray()) {
            node.forEach(suggestion -> {
                String workout = suggestion.path("workout").asText();
                String description = suggestion.path("description").asText();
                suggestions.add(String.format("%s: %s", workout, description));
            });
        }

        return suggestions.isEmpty() ? Collections.singletonList("No specific suggestions provided") : suggestions;
    }

    private List<String> extractSafetyInstructions(JsonNode node) {
        List<String> safetyMeasures = new ArrayList<>();

        if (node.isArray()) {
            node.forEach(safety -> {
                safetyMeasures.add(safety.asText());
            });
        }

        return safetyMeasures.isEmpty() ? Collections.singletonList("No specific Safety measures provided")
                : safetyMeasures;

    }

    private void addAnalysisSection(StringBuilder stringBuilder, JsonNode node, String key, String prefix) {
        if (!node.path(key).isMissingNode()) {
            stringBuilder.append(prefix).append(node.path(key).asText()).append("\n\n");
        }
    }

    private String createPromptForActivity(Activity activity) {
        return String
                .format("""

                          Analyze this fitness activity and provide detailed recommendations in the following format

                          {

                              "analysis" : {

                                  "overall": "Overall analysis here",

                                  "pace": "Pace analysis here",

                                  "heartRate": "Heart rate analysis here",

                                  "CaloriesBurned": "Calories Burned here"

                              },

                              "improvements": [

                                  {

                                      "area": "Area name",

                                      "recommendation": "Detailed Recommendation"

                                  }

                              ],

                              "suggestions" : [

                                  {

                                      "workout": "Workout name",

                                      "description": "Detailed workout description"

                                  }

                              ],

                              "safety": [

                                  "Safety point 1",

                                  "Safety point 2"

                              ]

                          }



                          Analyze this activity:

                          Activity Type: %s

                          Duration: %d minutes

                          calories Burned: %d

                          Additional Metrics: %s



                          provide detailed analysis focusing on performance, improvements, next workout suggestions, and safety guidelines

                          Ensure the response follows the EXACT JSON format shown above.

                        """,
                        activity.getType(),
                        activity.getDuration(),
                        activity.getCaloriesBurned(),
                        activity.getAdditionalMetrics() != null ? activity.getAdditionalMetrics().toString() : "{}"

                );
    }
}
