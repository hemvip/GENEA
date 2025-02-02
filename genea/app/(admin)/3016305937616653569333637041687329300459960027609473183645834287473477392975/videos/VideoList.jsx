import { memo } from "react"

const VideoList = memo(function VideoList({ videos }) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b py-4 text-left dark:border-neutral-700 ">
          <th className="py-2 pl-4 font-semibold">#ID</th>
          <th className="py-2 pl-4 font-semibold">Input Code</th>
          <th className="py-2 pl-4 font-semibold">Video Path</th>
          <th className="py-2 pl-4 font-semibold">Video</th>
          <th className="py-2 pl-4 font-semibold">System Name</th>
          <th className="py-2 pl-4 font-semibold">Submit At</th>
        </tr>
      </thead>
      <tbody className="align-baseline text-gray-900 dark:text-gray-100">
        {videos &&
          videos.map((video, index) => (
            <tr
              key={index}
              className="border-b border-gray-100 dark:border-neutral-700/50 align-middle"
            >
              <td className="py-2 pl-4">{index + 1}</td>
              <td className="py-2 pl-4">{video.inputcode}</td>
              <td className="py-2 pl-4">
                <div className="overflow-x-visible overflow-y-visible w-20 p-2">
                  <p className="w-20 truncate">{video.path}</p>
                </div>
              </td>
              <td className="py-2 pl-4 font-bold">
                <video controls className={"rounded-xl border h-40 w-40"}>
                  <source src={video.url} type="video/mp4" />
                </video>
              </td>
              <td className="py-2 pl-4 h-14">{video.systemname}</td>
              <td className="py-2 pl-4">
                <p className="truncate w-20">
                  {new Date(video.submitat).toLocaleString()}
                </p>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  )
})

export default VideoList
