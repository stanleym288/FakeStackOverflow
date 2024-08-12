const Dateandname = ({ item }) => {
    var date = new Date(item.asked_date_time)
    var currentDate = new Date();
    var name = item.asked_by

    if (((currentDate - date) / (1000 * 60 * 60)) < 24) {
        var timeDiffSec = (currentDate - date) / 1000;
        var timeRn = 0
        if (timeDiffSec < 60) {
            timeRn = Math.floor(timeDiffSec)
            return <p><span style={{ color: 'red' }}> {name} </span> asked {timeRn} seconds ago</p>
        } else if (timeDiffSec < 3600) {
            timeRn = Math.floor(timeDiffSec / 60)
            return <p><span style={{ color: 'red' }}> {name} </span> asked {timeRn} minutes ago</p>
        } else {
            timeRn = Math.floor(timeDiffSec / 3600)
            return <p><span style={{ color: 'red' }}> {name} </span> asked {timeRn} hours ago</p>
        }
    } else if (date.getFullYear() === currentDate.getFullYear()) {
        let month = date.toLocaleDateString('en-US', { month: 'short' });
        let day = date.getDate()
        let hours = String(date.getHours()).padStart(2, '0');
        let mins = String(date.getMinutes()).padStart(2, '0');
        return <p><span style={{ color: 'red' }}> {name} </span> asked {month} {day} at {hours}:{mins}</p>
    } else {
        let month = date.toLocaleDateString('en-US', { month: 'short' });
        let day = date.getDate()
        let year = date.getFullYear()
        let hours = String(date.getHours()).padStart(2, '0');
        let mins = String(date.getMinutes()).padStart(2, '0');
        return <p><span style={{ color: 'red' }}> {name} </span> asked {month} {day},  {year} at {hours}:{mins}</p>
    }

}

export default Dateandname