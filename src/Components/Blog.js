import React from 'react';


function Blog(props) {
    return (
        <div id='blog'>
            <div className='blog-heading'>
                <h1>Latest <span>Blog Posts</span></h1>
            </div>
            <div className='blog-container'>
                <div className='blog-card blog-card-1'>
                    <h2>Politics News</h2>
                    <p><span>Note:</span>Trump's ‘won't have to vote anymore’ remark didn't mean anything, Chris Sununu claims</p>
                    <a href="https://www.newsbreak.com/news/3542910263854-trump-s-won-t-have-to-vote-anymore-remark-didn-t-mean-anything-chris-sununu-claims" className='blog-btn'>Read Now</a>
                </div>

                <div className='blog-card blog-card-2'>
                    <h2>Finance News</h2>
                    <p><span>Note:</span>Why regional banks are now willing to take billions in losses</p>
                    <a href="https://finance.yahoo.com/news/why-regional-banks-are-now-willing-to-take-billions-in-losses-123009272.html" className='blog-btn'>Read Now</a>
                </div>

                <div className='blog-card blog-card-3'>
                    <h2>World News</h2>
                    <p><span>Note:</span>War between Russia and Ukraine</p>
                    <a href="https://www.independent.co.uk/news/world/europe/ukraine-russia-war-putin-biden-zelensky-latest-news-b2583524.html?page=7" className='blog-btn'>Read Now</a>
                </div>
            </div>
        </div>
    );
}

export default Blog;
