import ContentLoader from "react-content-loader"

const Paragraphe = (props:any) => (
  <ContentLoader 
    speed={2}
    // width={400}
    // height={160}
    
    viewBox="0 0 400 160"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="4" y="14" rx="3" ry="3" width="410" height="6" /> 
    <rect x="4" y="30" rx="3" ry="3" width="380" height="6" /> 
    <rect x="4" y="46" rx="3" ry="3" width="178" height="6" />
  </ContentLoader>
)

export default Paragraphe