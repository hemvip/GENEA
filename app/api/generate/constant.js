export const TEMPLATE_STUDY = {
  status: "new",
  name: "Pairwise Comparison of Gesture Generation AI Model Studies",
  prolific_userid: "",
  prolific_studyid: "",
  prolific_sessionid: "",
  completion_code: "",
  fail_code: "",
  total_actions: [],
  pages: [],
  time_start: "",
}

export const STARTUP_PAGE = {
  pageid: "",
  type: "generic",
  name: "Startup guide to participate gesture generation study",
  content: "",
  actions: [],
}

export const ATTENTION_CHECK_PAGE = {
  pageid: "",
  type: "check",
  name: "Attention Check",
  content: "Attention Check",
  selected: {
    value: 0,
    label: "",
  },
  attention_correct_value: "",
  actions: [],
  videos: [],
}

export const MAIN_PAGE = {
  pageid: "",
  type: "video",
  name: "",
  content: "How human-like was the agent in this video?",
  selected: {
    value: 0,
    label: "",
  },
  actions: [],
  videos: [],
}

export const FINISH_PAGE = {
  pageid: "",
  type: "finish",
  name: "Finish page",
  content: "",
  actions: [],
}

export const VIDEO_ITEM = {
  teamid: "",
  inputid: "",
  videoid: "",
  url: "",
}

export const VIDEO_CHECK_LEFTBETTER = {
  teamid: "",
  inputid: "",
  videoid: "",
  url: "https://f005.backblazeb2.com/file/gesture/attentioncheck/attetioncheck_leftbetter.mp4",
}

export const VIDEO_CHECK_EQUAL = {
  teamid: "",
  inputid: "",
  videoid: "",
  url: "https://f005.backblazeb2.com/file/gesture/attentioncheck/attetioncheck_equal.mp4",
}

export const VIDEO_CHECK_RIGHTBETTER = {
  teamid: "",
  inputid: "",
  videoid: "",
  url: "https://f005.backblazeb2.com/file/gesture/attentioncheck/attetioncheck_rightbetter.mp4",
}
