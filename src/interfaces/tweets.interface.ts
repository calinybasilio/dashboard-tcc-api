export interface ITweet {
    id: string;
    tweet: string;
    likes: number;
    replys: number;
    retweets: number;
    dateTweet: Date | string;
    journalistId: number;    
}