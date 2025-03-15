client.on('ready', async () => {
    const commands = client.application?.commands;
    await commands?.create({
        name: 'blacklist',
        description: 'Blacklists a user from the bot.',
        options: [
            {
                type: 'USER',  // Specify USER type to accept mentions
                name: 'user',
                description: 'The user to blacklist',
                required: true,
            },
        ],
    });
});
