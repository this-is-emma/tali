if (document.querySelector('#new-item')) {
    document.querySelector('#new-item').addEventListener('submit', (e) => {
        e.preventDefault();

        let item = {};
        const inputs = document.querySelectorAll('.form-control');
        for (const input of inputs) {
            item[input.name] = input.value;
        }

        axios.post('/items', item)
            .then(function (response) {
                window.location.replace(`/items/${response.data.item._id}`);
            })
            .catch(function (error) {
                const alert = document.getElementById('alert')
                alert.classList.add('alert-warning');
                alert.textContent = 'Oops, something went wrong saving this item. Please check your information and try again.';
                alert.style.display = 'block';
                setTimeout(() => {
                    alert.style.display = 'none';
                    alert.classList.remove('alert-warning');
                }, 3000)
            });
    });
}
