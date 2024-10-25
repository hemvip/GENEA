# User study input data

## System naming convention

- natural mocap data: NA
- submitted systems: SA, SB, ..., SZ
- baseline systems: BA, BB, BC, ...

## Filename format of test-set motion clips

- 12_zhao_2_2_2_segment_3
- 12_zhao_2_17_17_segment_2

## Example csv structure for pairwise human-likeness studies

```csv
clip_name, system_1, system_2,
12_zhao_2_2_2_segment_3, SA, SB
12_zhao_2_17_17_segment_2, SC, NA
13_lu_2_13_13_segment_2, SG, BA
```

## Example csv structure for pairwise emotion studies

```csv
clip_name, system_1, system_2, emotion
12_zhao_2_2_2_segment_3, SA, SB, anger
12_zhao_2_17_17_segment_2, SC, NA, happy
13_lu_2_13_13_segment_2, SG, BA, sad
```

## Example csv structure for speech appropriateness studies

```csv
clip_name, system, mismatch_type, mismatch_data
12_zhao_2_2_2_segment_3, SA, speech, 13_lu_2_13_13_segment_2
12_zhao_2_17_17_segment_2, BB, speech, 13_lu_2_13_13_segment_2
13_lu_2_13_13_segment_2, NA, speech, 12_zhao_2_17_17_segment_2
```

## Example csv structure for emotion mismatching studies

```csv
clip_name, system, mismatch_type, mismatch_data
12_zhao_2_2_2_segment_3, SA, emotion, sad
12_zhao_2_17_17_segment_2, BB, emotion, bored
13_lu_2_13_13_segment_2, NA, emotion, happy
```

400 compare => json -> studies screen (text, system1, system2)?

## URL conventions

The video visualisations of the clips should be stored in backblaze with convenient URLs, so that you can easily retrieve the video links based on the data in the csv file.

https://genea.backblazeb2.com/file/videos/systems/SB/12_zhao_2_2_2_segment_3.mp4

https://genea.backblazeb2.com/file/videos/baselines/BA/12_zhao_2_2_2_segment_3.mp4

https://genea.backblazeb2.com/file/videos/mismatched/speech/BA/12_zhao_2_2_2_segment_3_with_speech_from_13_lu_2_13_13_segment_2.mp4
https://genea.backblazeb2.com/file/videos/mismatched/emotion/BA/12_zhao_2_2_2_segment_3_with_emotion_sad_.mp4
