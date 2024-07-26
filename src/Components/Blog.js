import React from 'react';


function Blog(props) {
    return (
        <div id='blog'>
            <div className='blog-heading'>
                <h1>Latest <span>Blog Posts</span></h1>
            </div>
            <div className='blog-container'>
                <div className='blog-card blog-card-1'>
                    <h2>Politics</h2>
                    <p><span>Note:</span>News about US elections</p>
                    <a href="https://www.bloomberg.com/news/features/2024-07-22/biden-drops-out-plunging-2024-us-election-into-uncharted-territory?srnd=homepage-asia" className='blog-btn'>Read Now</a>
                </div>

                <div className='blog-card blog-card-2'>
                    <h2>Finance</h2>
                    <p><span>Note:</span>Singapore dollar appreciates</p>
                    <a href="https://www.bloomberg.com/news/articles/2024-07-21/singapore-dollar-has-reasons-to-win-asia-s-currency-crown-again?srnd=homepage-asia" className='blog-btn'>Read Now</a>
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
