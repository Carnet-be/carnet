import Skeleton, { SkeletonTheme } from "react-loading-skeleton"

const Paragraphe = () => (
  <SkeletonTheme baseColor="#202020" highlightColor="#444">
  <p>
      <Skeleton count={3} />
  </p>
</SkeletonTheme>
 
)

export default Paragraphe