import React from 'react'

const Tweet = ({ tweet, isOwner }) => {
  return (
    <div>
      <h4>{tweet.text}</h4>
      <p>{new Date(tweet.createdAt).toLocaleString()}</p>
      {isOwner && (
        <>
          <button>삭제하기</button>
          <button>수정하기</button>
        </>
       )
      }
    </div>
  )
}

export default Tweet;