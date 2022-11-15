import Link from 'next/link' ;

function MockHeader(){
  return(
    <div>
      <Link href='/'>
        <h1 style={{display: 'inline'}}> LOGO </h1>
      </Link>
      <Link href='/post/create'>
        <button> 모의 면접 모집 </button>
      </Link>
    </div>
  );
}

export default MockHeader ;
