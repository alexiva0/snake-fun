const API_BASE_URL = "http://localhost:8000/api"

const getUrl = (path) => API_BASE_URL + path;

export const getHighScore = async () => {
    return fetch(getUrl("/score/"))
        .then((res) => res.json())
        .then((data) => data.high_score)
}

export const setHighScore = async (highScore) => {
    return fetch(getUrl("/score/"), {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            high_score: highScore
        })
    })
        .then((res) => res.json())
        .then((data) => data.high_score)
}
