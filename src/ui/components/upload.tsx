import { Uploader } from 'rsuite';

const Upload = () => {
  return (
  <div className='w-full'>
      <Uploader action="//jsonplaceholder.typicode.com/posts/" draggable multiple>
      <div style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="w-full">
        <span>Click or Drag images</span>
      </div>
    </Uploader>
  </div>
  );
};

export default Upload