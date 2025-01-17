# Storage Structure

## Naming conventions

### System naming convention

- natural mocap data: NA
- submitted systems: SA, SB, ..., SZ
- baseline systems: BA, BB, BC, ...

### Filename format of test-set motion clips

- 12_zhao_2_2_2_segment_3
- 12_zhao_2_17_17_segment_2

### Example csv structure for pairwise human-likeness studies

```csv
clip_name, system_1, system_2,
12_zhao_2_2_2_segment_3, SA, SB
12_zhao_2_17_17_segment_2, SC, NA
13_lu_2_13_13_segment_2, SG, BA
```

### Example csv structure for pairwise emotion studies

```csv
clip_name, system_1, system_2, emotion
12_zhao_2_2_2_segment_3, SA, SB, anger
12_zhao_2_17_17_segment_2, SC, NA, happy
13_lu_2_13_13_segment_2, SG, BA, sad
```

### Example csv structure for speech appropriateness studies

```csv
clip_name, system, mismatch_type, mismatch_data
12_zhao_2_2_2_segment_3, SA, speech, 13_lu_2_13_13_segment_2
12_zhao_2_17_17_segment_2, BB, speech, 13_lu_2_13_13_segment_2
13_lu_2_13_13_segment_2, NA, speech, 12_zhao_2_17_17_segment_2
```

### Example csv structure for emotion mismatching studies

```csv
clip_name, system, mismatch_type, mismatch_data
12_zhao_2_2_2_segment_3, SA, emotion, sad
12_zhao_2_17_17_segment_2, BB, emotion, bored
13_lu_2_13_13_segment_2, NA, emotion, happy
```

### URL conventions

The video visualisations of the clips should be stored in backblaze with convenient URLs, so that you can easily retrieve the video links based on the data in the csv file.

https://genea.backblazeb2.com/file/videos/systems/SB/12_zhao_2_2_2_segment_3.mp4
https://genea.backblazeb2.com/file/videos/baselines/BA/12_zhao_2_2_2_segment_3.mp4
https://genea.backblazeb2.com/file/videos/mismatched/speech/BA/12_zhao_2_2_2_segment_3_with_speech_from_13_lu_2_13_13_segment_2.mp4
https://genea.backblazeb2.com/file/videos/mismatched/emotion/BA/12_zhao_2_2_2_segment_3_with_emotion_sad_.mp4

## Blackblaze folder structure

### Motions

```dir
/motions
/motions/<github_username>/<motion_file>.npy
```

**Example** of motions folder structure

```dir
/motions/username1/<submitted_systems_1_motion_1>.npy
/motions/username2/<submitted_systems_2_motion_2>.npy
```

### Videos

Video folder structure

```dir
/videos

/video/systems
/video/baselines

/videos/<study_type>/<system_name>/<video_segment_name>.mp4

/video/mismatched/speech
/video/mismatched/emotion

/videos/mismatched/<study_type>/<system_name>/<video_segment_name>.mp4
```

**Example** of videos folder structure

```dir
/videos/systems/SA/<video_segment_1>.mp4
/videos/systems/SA/<video_segment_2>.mp4
/videos/systems/SB/<video_segment_1>.mp4
/videos/systems/SB/<video_segment_2>.mp4
/videos/systems/SC/<video_segment_1>.mp4
/videos/systems/SC/<video_segment_2>.mp4

/videos/baselines/BA/<video_segment_1>.mp4
/videos/baselines/BA/<video_segment_2>.mp4

/videos/mismatched/speech/NA/<video_segment_1>.mp4
/videos/mismatched/speech/BA/<video_segment_1>.mp4
/videos/mismatched/speech/SA/<video_segment_1>.mp4
/videos/mismatched/speech/SB/<video_segment_1>.mp4

/videos/mismatched/emotion/NA/<video_segment_1>.mp4
/videos/mismatched/emotion/BA/<video_segment_1>.mp4
/videos/mismatched/emotion/SA/<video_segment_1>.mp4
/videos/mismatched/emotion/SB/<video_segment_1>.mp4
```
