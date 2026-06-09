import fs from 'fs';

const data = JSON.parse(fs.readFileSync('logs/inbox_graphql.json'));
const threads = data.data.get_slide_mailbox_for_iris_subscription.threads_by_folder.edges.map(e => e.node.as_ig_direct_thread);

for (const thread of threads) {
  const otherUser = thread.users[0];
  const lastMessage = thread.slide_messages?.edges?.[0]?.node;
  
  if (!otherUser || !lastMessage) continue;
  
  const isIncoming = lastMessage.sender_fbid === otherUser.interop_messaging_user_fbid || 
                     lastMessage.sender_fbid === otherUser.id; // Sometimes it's the raw id?
                     
  console.log(`Thread with @${otherUser.username}:`);
  console.log(`  Incoming: ${isIncoming}`);
  console.log(`  Text: "${lastMessage.text_body || 'none'}"`);
}
