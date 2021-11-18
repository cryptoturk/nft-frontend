var Web3;
var window;
var web3 = new Web3(Web3.givenProvider);
var infura_pID = "563a1906d51f46b4b6cc3012ef766cc3";
var bscaddress="0x"; 
var bscconnected;
var audioPunches = new Audio("assets/punches.mp3");
var audioWin = new Audio("assets/win.mp3");
var audioLose = new Audio("assets/lose.mp3");
var audioConfetti = new Audio("assets/confetti.mp3");
var audioWawa = new Audio("assets/wawa.mp3");

function isConnected() {
  document.getElementById('web3-wrapper').style.display = 'flex';
  document.getElementById('metamaskbtn').style.display = 'none';
  // document.getElementById('tokenListContainer').style.display = "flex";
  // document.getElementById('potionContainer').style.display = "block";
  // document.getElementById('address').style.display = "block";
} 
function isNotConnected() {
  document.getElementById('web3-wrapper').style.display = 'none';
  document.getElementById('metamaskbtn').style.display = "flex";
  // document.getElementById('tokenListContainer').style.display = "none";
  // document.getElementById('potionContainer').style.display = "none";
  // document.getElementById('address').style.display = "none";
}

// detectChainId()
// DETECT NETWORK FOR DOCUMENT READY
async function detectChainId () {
  const provider = await detectEthereumProvider()
  if (provider) {
    const chainidnetwork = await provider.request({
      method: 'eth_chainId'
    })
    let networkText = document.getElementById('networkText');
    let networkLight = document.getElementById('networkLight');

    switch(chainidnetwork) {
      case "0x1":
        networkText.innerText = 'Ethereum Main Network (Mainnet)'
        networkLight.style.backgroundColor = '#ff0016'
        networkLight.style.boxShadow  = '0 0 6px 5px rgba(255, 0, 22, 0.4)'
      break;
      case "0x3":
        networkText.innerText = 'Ropsten Test Network'
        networkLight.style.backgroundColor = '#ff0016'
        networkLight.style.boxShadow  = '0 0 6px 5px rgba(255, 0, 22, 0.4)'
      break;
      case "0x4":
        networkText.innerText = 'Rinkeby Test Network'
        networkLight.style.backgroundColor = '#ff0016'
        networkLight.style.boxShadow  = '0 0 6px 5px rgba(255, 0, 22, 0.4)'
      break;
      case "0x5":
        networkText.innerText = 'Goerli Test Network'
        networkLight.style.backgroundColor = '#ff0016'
        networkLight.style.boxShadow  = '0 0 6px 5px rgba(255, 0, 22, 0.4)'
      break;
      case "0x2a":
        networkText.innerText = 'Kovan Test Network'
        networkLight.style.backgroundColor = '#ff0016'
        networkLight.style.boxShadow  = '0 0 6px 5px rgba(255, 0, 22, 0.4)'
      break;
      case "0x38":
        networkText.innerText = 'Binance Smart Chain (Mainnet)'
        networkLight.style.backgroundColor = '#ff0016'
        networkLight.style.boxShadow  = '0 0 6px 5px rgba(255, 0, 22, 0.4)'
      break;
      case "0x61":
        networkText.innerText = 'Binance Smart Chain (Testnet)'
        networkLight.style.backgroundColor = '#00ff04'
        networkLight.style.boxShadow  = '0 0 6px 5px rgba(0, 255, 4, 0.4)'
      break;
      default:
        networkText.innerText = 'Other Network'
        networkLight.style.backgroundColor = '#ff0016'
        networkLight.style.boxShadow  = '0 0 6px 5px rgba(255, 0, 22, 0.4)'
    }
  } else {
    document.getElementById('networkText').innerText = 'Please install MetaMask to use this dApp!'
  }
} 

// update how many token left to be mined
async function updateNum(networkChain) {
  var mintButton = document.getElementById("mintButton");
  var mintInfo = document.getElementById("haremsMintInfo");
  var remaining = document.getElementById("remainingToMint");
  var krakenInput = document.getElementById("slide-container-for-class");

  if(networkChain == "0x61") {
    const numLeftToMint  = await leftToMint();

    if(numLeftToMint > 0) {
      remaining.innerHTML = `Total Kraken monster minted until now: ${numWithCommas(numLeftToMint)} / ${numWithCommas(MAX_SUPPLY)} `;
    }

    if(numLeftToMint == MAX_SUPPLY) {
      mintButton.innerHTML = "All the Kraken Monsters have been minted";
      mintButton.disabled = true;
      mintInfo.style.display =  "none";
      krakenInput.style.display =  "none";
      remaining.innerHTML = `Total Kraken monster minted until now: ${numWithCommas(MAX_SUPPLY)} / ${numWithCommas(MAX_SUPPLY)} `;
    } 
  } else {
    remaining.innerHTML = `Switch to BSC network to see how many Kraken left`;
  }
}

// DOCUMENT READY
window.onload = async function(){ 
  if (window.ethereum) {
    // if account connected
    await web3.eth.getAccounts(function(err, accounts){
      if (err != null) console.error("An error occurred: "+err);
      else if (accounts.length == 0) {
        isNotConnected();
        console.log("User is not logged in to MetaMask");
        bscconnected = false;
        detectChainId();
      }
      else {
        bscaddress = accounts[0];
        document.getElementById('address').innerText = bscaddress;
        // isConnected();
        bscconnected = true;
        detectChainId();
      };
    }); 
    
    //if network correct
    const provider = await detectEthereumProvider()
    const chainidnetwork = await provider.request({
      method: 'eth_chainId'
    })
    if(bscconnected){
      if (chainidnetwork != "0x61") {
        isNotConnected();
        
      } else {
        isConnected();
        getMonsterPower();
        clearBattleDom();
        updateBattles();
      } 
    }
    
    updateNum(chainidnetwork);

  } else {
      isNotConnected();
      const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })
          
      Toast.fire({
        icon: 'warning',
        title: 'No provider was found'
      })
      return;
  }
}


async function getAccounts() {
  try {
    let acc = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    return acc;
  } catch (e) {
    return [];
  }
}

//CONNECT and SWITCH
async function connectWeb3Account() {
  if (window.ethereum) {
    
    try {
      window.web3 = new Web3(window.ethereum);
      conn = await ethereum.request({ method: "eth_requestAccounts" });
      // console.log(conn);
      bscconnected = conn.length > 0
      if (bscconnected) {
        bscaddress = conn[0]
        document.getElementById('address').innerText = bscaddress;
      }
      
      await switchNetwork()
    
      return true;
    } catch (e) {
      if (e.code == 4001) {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
  
        Toast.fire({
          icon: 'warning',
          title: 'User rejected the request'
        })
      } else console.log(e)
    }
  } else {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: 'warning',
      title: 'No provider was found'
    })
    return;
  } 
}

async function switchNetwork() {
  // Check if MetaMask is installed
  if (window.ethereum) {
    try {
      // check if the chain to connect to is installed
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x61' }], // chainId must be in hexadecimal numbers
      });
      detectChainId()
      clearBattleDom();
      updateBattles();
      // getMonsterPower()
    } catch (error) {
      // This error code indicates that the chain has not been added to MetaMask
      // if it is not, then install it into the user MetaMask
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainName: 'Binance Smart Chain Testnet',
                nativeCurrency: {
                  name: 'BNB',
                  symbol: 'BNB',
                  decimals: 18
                },
                chainId: '0x61',
                rpcUrl: `https://data-seed-prebsc-1-s3.binance.org:8545/`,
                blockExplorerUrls: 'https://testnet.bscscan.com'
              },
            ],
          });
          detectChainId()
          getMonsterPower()
          clearBattleDom();
          updateBattles();
        } catch (addError) {
          console.error(addError);
        }
      } else {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
        Toast.fire({
          icon: 'warning',
          title: error.message
        })
      }
    }
  } 
}

// general listener for ACCOUNT CHANGES
if (window.ethereum) {
  window.ethereum.on('accountsChanged', async (accounts) => {
    const provider = await detectEthereumProvider()
    if (provider) {
      const chainidnetwork = await provider.request({
        method: 'eth_chainId'
      })
      
      if(chainidnetwork == "0x61") {
        if(accounts.length > 0) {
          bscaddress = accounts[0];
          isConnected()
          document.getElementById('address').innerHTML = bscaddress;
          updateMonster();
          getMonsterPower();
          clearBattleDom();
          updateBattles();
        } else {
          clearBattleDom();
        }
    
        if(!accounts.length) {
          bscconnected = false;
          bscaddress = accounts[0];
          isNotConnected();
          updateMonster();
          clearBattleDom();
          updateBattles();
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })
          
          Toast.fire({
            icon: 'info',
            title: 'Wallet is disconnected now'
          })
        }
      }
    }  
  })
}

// general listener NETWORK CHANGES
if (window.ethereum) {
  window.ethereum.on('chainChanged', async (chainId) => {
    window.ethereum.autoRefreshOnNetworkChange = false;
    
    let networkText = document.getElementById('networkText');
    let networkLight = document.getElementById('networkLight');

    switch(chainId) {
      case "0x1":
        networkText.innerText = 'Ethereum Main Network (Mainnet)'
        networkLight.style.backgroundColor = '#ff0016'
        networkLight.style.boxShadow  = '0 0 6px 5px rgba(255, 0, 22, 0.4)'
      break;
      case "0x3":
        networkText.innerText = 'Ropsten Test Network'
        networkLight.style.backgroundColor = '#ff0016'
        networkLight.style.boxShadow  = '0 0 6px 5px rgba(255, 0, 22, 0.4)'
      break;
      case "0x4":
        networkText.innerText = 'Rinkeby Test Network'
        networkLight.style.backgroundColor = '#ff0016'
        networkLight.style.boxShadow  = '0 0 6px 5px rgba(255, 0, 22, 0.4)'
      break;
      case "0x5":
        networkText.innerText = 'Goerli Test Network'
        networkLight.style.backgroundColor = '#ff0016'
        networkLight.style.boxShadow  = '0 0 6px 5px rgba(255, 0, 22, 0.4)'
      break;
      case "0x2a":
        networkText.innerText = 'Kovan Test Network'
        networkLight.style.backgroundColor = '#ff0016'
        networkLight.style.boxShadow  = '0 0 6px 5px rgba(255, 0, 22, 0.4)'
      break;
      case "0x38":
        networkText.innerText = 'Binance Smart Chain (Mainnet)'
        networkLight.style.backgroundColor = '#ff0016'
        networkLight.style.boxShadow  = '0 0 6px 5px rgba(255, 0, 22, 0.4)'
      break;
      case "0x61":
        networkText.innerText = 'Binance Smart Chain (Testnet)'
        networkLight.style.backgroundColor = '#00ff04'
        networkLight.style.boxShadow  = '0 0 6px 5px rgba(0, 255, 4, 0.4)'
      break;
      default:
        networkText.innerText = 'Other Network'
        networkLight.style.backgroundColor = '#ff0016'
        networkLight.style.boxShadow  = '0 0 6px 5px rgba(255, 0, 22, 0.4)'
    }

    if(bscconnected){
      if (chainId != "0x61") {
        isNotConnected();
        updateMonster();
        
      } else {
        isConnected();
        updateMonster();
        getMonsterPower();
      } 
    } 

    updateNum(chainId);

  })
}



// Mint NFTs
async function mint() {
  if (window.ethereum) {
    var krakenAmount = document.getElementById('_name');
    if(krakenAmount.value == "") {
      Swal.fire({
        icon: 'error',
        title: 'Kraken name',
        text: `Kraken name should not be empty`,
      })
    } else if(krakenAmount.value.length < 5) {
      Swal.fire({
        icon: 'error',
        title: 'Kraken name',
        text: `Minimum 5 characters`,
      })
    } else {
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      let account = await web3.eth.getAccounts();
      if (account.length == 0 || chainId != 0x61) {
        Swal.fire({
          icon: 'warning',
          title: 'Connection error',
          text: `Please connect to Metamask and then switch to BSC network.`,
        })
      } else {
            let totalToMint = 1;
            let tokenName = document.getElementById('_name').value;
  
            const result = await this.getAccounts();
            let accou = result[0];
            const nonce = await web3.eth.getTransactionCount(accou, 'latest'); // nonce starts counting from 0
  
            window.contract = await new web3.eth.Contract(mainnetAbi, mainnetContract);
  
            try {
              await web3.eth.sendTransaction({
                nonce: nonce.toString(),
                to: mainnetContract,
                from: accou,
                value: COST,
                data: window.contract.methods.mint(tokenName, accou, totalToMint).encodeABI(),
                // gasPrice: web3.utils.toHex(web3.utils.toWei('20','gwei')),
              })
              .on('transactionHash', function (hash) {
                Swal.fire({
                  title: 'Please wait while minting your NFT',
                  showConfirmButton: false,
                  allowOutsideClick: false,
                  allowEscapeKey: false,
                  didOpen: () => {
                    Swal.showLoading()
                  }
                })
                console.log(`Please wait.`)
              })
              .on('receipt', function (receipt) {
                console.log(receipt);
                Swal.fire({
                  icon: 'success',
                  title: 'Congratulations',
                  text: `TX ID: ${receipt.transactionHash}`,
                  showCancelButton: true,
                  confirmButtonColor: '#1e90ff',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'See at Etherscan'
                }).then((result) => {
                  if (result.isConfirmed) {
                    window.open(`https://testnet.bscscan.com/tx/${receipt.transactionHash}`, '_blank');
                  }
                })
                updateMonster();
                getMonsterPower();
                clearBattleDom();
                updateBattles();
                updateNum(chainId); 
              })
              .on('error', function (error, receipt) {
                if (error.code === 4001) {
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops',
                    text: 'User denied transaction signature',
                  })
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops',
                    text: error.message,
                  })
                }
              });
            } catch (error) {
              console.log("Failed with error: " + error.message);
            }
          
      }
    }
  } else {
    const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
        
    Toast.fire({
      icon: 'warning',
      title: 'No provider was found'
    })
    return;
  }

}

//number of minted tokens
async function leftToMint() {
  window.contract = await new web3.eth.Contract(mainnetAbi, mainnetContract);
  const numMinted = parseInt(await window.contract.methods.totalSupply().call());
  return numMinted;
}

function numWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// clear tokenList div
function updateMonster() {
  const myNode = document.getElementById("tokenList");
  myNode.innerHTML = '';
}

// load monster erc721 tokens
async function getMonsterPower() {

  window.contract = await new web3.eth.Contract(mainnetAbi, mainnetContract);

  const result = await this.getAccounts();
  bscaddress = result[0];

  allTokens = await window.contract.methods.walletOfOwner(bscaddress).call();
  
  var contDiv = document.getElementById('tokenList');

  if (allTokens.length == 0) {
    contDiv.innerHTML = `You have ${allTokens.length} Kraken. Mint your first Kraken`;
    document.getElementById('potionEmpty').style.display = "block";
    document.getElementById('potionContainer').style.display = "none";
    document.getElementById('battleEmpty').style.display = "block";
    document.getElementById('battleContainer').style.height = "auto";
    document.getElementById('battleListContainer').style.display = "none";
    return ""; 
  } else {
      document.getElementById('potionEmpty').style.display = "none";
      document.getElementById('potionContainer').style.display = "block";
      document.getElementById('battleEmpty').style.display = "none";
      document.getElementById('battleListContainer').style.display = "block";
      document.getElementById('battleContainer').style.maxHeight  = "500px";
      for (let index = 0; index < allTokens.length; index++) {
      const monsterPower = await window.contract.methods.getMonsterPower(allTokens[index]).call();
      var tokenDiv = document.createElement('div');
      tokenDiv.setAttribute("id", "token" + index);

      contDiv.appendChild(tokenDiv);
      
   
      document.getElementById("token" + index).innerHTML = `
      <img id="nftImg" src="${baseURI}${allTokens[index]}.png">
      <div class="frame-header"> 
        <p>Token Id: <span>${allTokens[index]}</span> </p>
        <p class="status" id="status${index}"></p>
      </div>
      <p class="frame-type-line">
        <span id="tokenName${index}">${monsterPower[0]}</span>
        <svg class="heart" width="20" height="20" viewBox="0 0 32 29.6">
          <path d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z" />
          <text id="health${index}" x="50%" y="50%" fill="white" dominant-baseline="middle" text-anchor="middle">${monsterPower[3]}</text>
        </svg>
      </p>
      <div class="frame-text-box">
        <p>Wins: <span id="winnings${index}">${monsterPower[1]}</span></p>
        <p>Losses: <span id="losings${index}">${monsterPower[2]}</span></p>
        <p>Attack: <span id="attackP${index}">${monsterPower[4]}</span></p>
        <p>Defence: <span id="defenceP${index}">${monsterPower[5]}</span></p>
        <p>Speed: <span id="speedP${index}">${monsterPower[6]}</span></p>
      </div>`
      

        if(monsterPower[5] < monsterPower[4]) {
          document.getElementById('status' + index).innerHTML='<img src="assets/attacker.png">';
          // document.querySelector(":root").style.setProperty('--seconderColor', '#7c7c7c');

        } else {
          document.getElementById('status' + index).innerHTML='<img src="assets/defender.png">';
          // document.querySelector(":root").style.setProperty('--seconderColor', '#6e436d');
        }

      }
  }
}

//Approve before potion payment 
async function feed(payment,feedFunc) {
  console.log(feedFunc);
  if (window.ethereum) {
    var contractToken = new web3.eth.Contract(tokenAbi, tokenContract);
    const chainId = await ethereum.request({ method: 'eth_chainId' });
    let account = await web3.eth.getAccounts();
    if (account.length == 0 || chainId != 0x61) {
      Swal.fire({
        icon: 'warning',
        title: 'Connection error',
        text: `Please connect to Metamask and then switch to BSC mainnet.`,
      })
    } else {
      let account = await web3.eth.getAccounts();
    //check if approve method used before
      const approval = await contractToken.methods.allowance(account[0], mainnetContract).call();
      
      if (approval > 0) {
        feed1(payment,feedFunc); 
      } else {
        let account = await web3.eth.getAccounts();
        const maxUint = 999999999999999999999999;
        let amount = new BigNumber(maxUint).multipliedBy(new BigNumber(10).exponentiatedBy(18)).toString(10)

        contractToken.methods.approve(mainnetContract, amount).send({ from: account[0] })
          .on('transactionHash', function (hash) {
            Swal.fire({
              title: `Approve is needed one time. Payment authorization in process. Enter token ID and confirm deposit after authorization completed`,
              showConfirmButton: false,
              allowOutsideClick: false,
              allowEscapeKey: false,
              didOpen: () => {
                Swal.showLoading()
              }
            })
            console.log(`Payment authorization in process. ${hash}`)
          })
          .on('receipt', function (receipt) {
            Swal.fire({
              icon: 'success',
              title: 'Congrats',
              text: `Payment authorization accepted. ${receipt.transactionHash}`,
            })
            console.log(`Payment authorization accepted. ${receipt.transactionHash}`)
            feed1(payment,feedFunc);
          })
          .on('error', function (error) {
            if (error.code === 4001) {
              Swal.fire({
                icon: 'error',
                title: 'Oops',
                text: 'User denied transaction signature',
              })
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops',
                text: error.message,
              })
            }
            console.log(`Payment authorization failed. ${error?.message}`)
          })
          .catch((error) => {
            console.log(`Payment authorization error. ${error?.message}`)
          });
      }
    }
  } else {
    const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
        
    Toast.fire({
      icon: 'warning',
      title: 'No provider was found'
    })
    return;
  }
}

// FEED NFTs
async function feed1(payment,feedFunc) {
  // var result = await feedFunc;
  console.log(feedFunc);

  let account = await web3.eth.getAccounts();
  const price = new BigNumber(payment).multipliedBy(1000000000000000000n);
  // console.log(price);

  let contract = await new web3.eth.Contract(mainnetAbi, mainnetContract);

  const { value: id } = await Swal.fire({
    input: 'text',
    inputLabel: 'Enter the Token Id',
    inputPlaceholder: '0'
  })
  
  if (id) {
    switch (feedFunc) {
      case "feedMonsterWithFruit1":
        var feedFunction = contract.methods.feedMonsterWithFruit1(id,price).send({from: account[0]})
        break;
      case "feedMonsterWithFruit2":
        var feedFunction = contract.methods.feedMonsterWithFruit2(id,price).send({from: account[0]})
        break;
      case "feedMonsterWithFruit3":
        var feedFunction = contract.methods.feedMonsterWithFruit3(id,price).send({from: account[0]})
        break;
      case "feedMonsterWithFruit4":
        var feedFunction = contract.methods.feedMonsterWithFruit4(id,price).send({from: account[0]})
        break;
      case "feedMonsterWithFruit5":
        var feedFunction = contract.methods.feedMonsterWithFruit5(id,price).send({from: account[0]})
        break;
      case "feedMonsterWithFruit6":
        var feedFunction = contract.methods.feedMonsterWithFruit6(id,price).send({from: account[0]})
        break;
    
      default:
        break;
    }
    feedFunction.on('transactionHash', function (hash) {
        Swal.fire({
          title: `Your Kraken is drinking...`,
          showConfirmButton: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => {
            Swal.showLoading()
          }
        })
        console.log(`in process ${hash}`)
      })
      .on('receipt', function (receipt) {
        Swal.fire({
          icon: 'success',
          title: 'Kraken Improved',
          text: `TX ID: ${receipt.transactionHash}`,
        })
        updateMonster();
        getMonsterPower();
        console.log(`completed. ${receipt.transactionHash}`)
      })
      .on('error', function (error) {
        if (error.code === 4001) {
          Swal.fire({
            icon: 'error',
            title: 'Oops',
            text: 'User denied transaction signature',
          })
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops',
            text: error.message,
          })
        }
        console.log(`Deposit failed. ${error?.message}`)
      })
      .catch(error => {
        console.log(`Deposit error. ${error?.message}`)
      });
  } 
}


//BATTLE PART

function clearBattleDom() {
  const myNode = document.getElementById("battleList");
  myNode.innerHTML = '';
}

async function getBattlesCount() {
  let contract = await new web3.eth.Contract(mainnetAbi, mainnetContract);
  let result = contract.methods.getBattlesCount().call().then(balanceWallet => {
    return balanceWallet;
  });
  return result;
}

async function updateBattles() {
  let contract = await new web3.eth.Contract(mainnetAbi, mainnetContract);
  const battlesCount = await getBattlesCount();
  // console.log(battlesCount);
  var battleDiv = document.getElementById('battleList');

  if (battlesCount == 0) {
    // document.getElementById('battleListContainer').innerHTML = `
    // <p>There is ${battlesCount} battle. Create your first battle</p>
    // <button id="createBattleBtn2" onClick="createBattle();">Create Battle</button>`
    document.getElementById('battleEmpty2').style.display = "block";
    document.getElementById('battleTableContainer').style.display = "none";
    return ""; 
  } else {
    document.getElementById('battleEmpty2').style.display = "none";
    document.getElementById('battleTableContainer').style.display = "block";
    for (let i = 0; i < battlesCount; i++) {
      const battles = await contract.methods.battles(i).call();

      var tokenDiv = document.createElement('tr');
      tokenDiv.setAttribute("id", "battle" + i);

      battleDiv.appendChild(tokenDiv);
      battleDiv.insertBefore(tokenDiv, battleDiv.childNodes[0]);
      
   
      document.getElementById("battle" + i).innerHTML = `
          <span id='battleView' style="width:10px;height:10px;border-radius:50%;position:relative;left:5px;background:#0bc214"></span>
          <td style="width:10%">${i}</td>
          <td style="width:10%" id ="endedBat${i}">${battles.ended}</td>
          <td style="width:10%" id ="winnerBat${i}">${battles.winnerId}</td>
          <td style="width:25%;display: flex; align-items: center; justify-content: center;" id ="warBat${i}"><img src="${baseURI}${battles.p1CarId}.png"><img src="assets/vs.png"><img src="${baseURI}${battles.p2CarId}.png"></td>
          <td style="width:22.5%"><button id ="acceptBat${i}" onclick="acceptBattle(${i});">Accept Battle</button></td>
          <td style="width:22.5%"><button id ="endBat${i}" onClick="endBattle(${i});">Upgrade Kraken</button></td>`
      
      if(battles.ended == 2) {
        document.getElementById("endedBat" + i).innerText = "Ended";
        document.getElementById("acceptBat" + i).disabled = true;
        document.getElementById("acceptBat" + i).style.opacity = "0.5";
        document.getElementById("endBat" + i).disabled = true;
        document.getElementById("endBat" + i).style.opacity = "0.5";
      }else if(battles.ended == 1) {
        document.getElementById("endedBat" + i).innerText = "Claim";
        document.getElementById("acceptBat" + i).disabled = true;
        document.getElementById("acceptBat" + i).style.opacity = "0.5";
        if (allTokens.includes(battles.winnerId)) {
          document.getElementById("endBat" + i).disabled = false;
        } else {
          document.getElementById("endBat" + i).disabled = true;
          document.getElementById("endBat" + i).style.opacity = "0.5";
        }
      }else if(battles.ended == 0) {
        document.getElementById("endedBat" + i).innerText = "Open";
        document.getElementById("endBat" + i).disabled = true;
        document.getElementById("endBat" + i).style.opacity = "0.5";
        document.getElementById("winnerBat" + i).innerText = "-";
        document.getElementById("warBat" + i).innerHTML = `<img src="assets/quest1.png"><img src="assets/vs.png"><img src="assets/quest.png">`;
        if (allTokens.includes(battles.p1CarId)) {
          document.getElementById("acceptBat" + i).disabled = true;
          document.getElementById("acceptBat" + i).style.opacity = "0.5";
        }
      }
      
      // console.log(allTokens);
      if (allTokens.includes(battles.p1CarId) || allTokens.includes(battles.p2CarId)) {
        document.getElementById('battleView').style.opacity = "1";
      } else {
        document.getElementById('battleView').style.opacity = "0";
      }

    }
  
  }
  
}

async function acceptBattle(battleId) {
  console.log(battleId);
  let contract = await new web3.eth.Contract(mainnetAbi, mainnetContract);
  let account = await web3.eth.getAccounts();
  const { value: id } = await Swal.fire({
    input: 'text',
    inputLabel: 'Enter the Token Id',
    inputPlaceholder: '0'
  })
  if(id) {
    console.log(account[0]);
    contract.methods.acceptBattle(battleId,id).send({from: account[0]})
    .on('transactionHash', async function (hash) {
      const battles = await contract.methods.battles(battleId).call();
      const p1 = battles.p1CarId;
      Swal.fire({
        html:`<div id="animationContainer">
                <div id="innerR">
                  <img src="${baseURI}${p1}.png">
                </div>
                <img src="assets/vs.png" id="merger">
                <div id="innerL">
                  <img src="${baseURI}${id}.png">
                </div>
              </div>
              <div id="animation">
                <img src="assets/fight-cartoon.gif">
              </div>`,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        
      })
      
      document.getElementById('innerR').style.flex = "1";
      document.getElementById('innerL').style.flex = "1";
      document.getElementById('innerR').style.justifyContent = "flex-end";
      document.getElementById('innerL').style.justifyContent = "flex-start";
      document.getElementById('merger').style.transform = "scale(1.5)";
      var element = document.getElementById("animationContainer");
      element.classList.add("flashlight");
      
      setTimeout(()=>{ 
          audioPunches.play();
          document.getElementById("animationContainer").style.display = "none";
          document.getElementById("animation").style.display = "flex";
      }, 2000);
      console.log(`in process ${hash}`)
    })
    .on('receipt', async function (receipt) {
      audioPunches.pause();
      audioPunches.currentTime = 0;
      const battles = await contract.methods.battles(battleId).call();
      const winner = battles.winnerId;
      const p1 = battles.p1CarId;

      if(winner == id) {
        Swal.fire({
          // icon: 'success',
          // title: 'You won',
          // text: `TX ID: ${receipt.transactionHash}`,
          html:`<div id="WanimationContainer">
                  <div id="tsparticles"></div>
                  <div id="WinnerR">
                    <img src="${baseURI}${p1}.png">
                  </div>
                  <img src="assets/vs.png" id="Wmerger">
                  <div id="WinnerL">
                    <img src="${baseURI}${id}.png">
                  </div>
                </div>`,
        })
        
        
        var element = document.getElementById("WanimationContainer");
        element.classList.add("Wflashlight");

        setTimeout(() => {
          document.getElementById("Wmerger").style.transform = "scale(0)";
          setTimeout(() => {
            audioWin.play();
            document.getElementById("WinnerR").style.transform = "scale(0)";
            setTimeout(() => {
              document.getElementById("WinnerR").style.display = "none";
              setTimeout(() => {
                document.getElementById("WinnerL").style.transform = "scale(1.5)";
                audioConfetti.play();
                tsParticles.load("tsparticles", {
                  fpsLimit: 60,
                  particles: {
                    number: {
                      value: 200
                    },
                    color: {
                      value: ["#9146FF", "#FFAAA8", "#8FFFD2", "#FFD37A", "#FF38DB"]
                    },
                    shape: {
                      type: "confetti",
                      options: {
                        confetti: {
                          type: ["circle", "square"]
                        }
                      }
                    },
                    opacity: {
                      value: 1,
                      animation: {
                        enable: true,
                        minimumValue: 0,
                        speed: 2,
                        startValue: "max",
                        destroy: "min"
                      }
                    },
                    size: {
                      value: 7,
                      random: {
                        enable: true,
                        minimumValue: 3
                      }
                    },
                    links: {
                      enable: false
                    },
                    life: {
                      duration: {
                        sync: true,
                        value: 5
                      },
                      count: 1
                    },
                    move: {
                      enable: true,
                      gravity: {
                        enable: true,
                        acceleration: 20
                      },
                      speed: 50,
                      decay: 0.1,
                      direction: "none",
                      random: false,
                      straight: false,
                      outModes: {
                        default: "destroy",
                        top: "none"
                      }
                    }
                  },
                  interactivity: {
                    detectsOn: "canvas",
                    events: {
                      resize: true
                    }
                  },
                  detectRetina: true,
                  background: {
                    color: "#fff"
                  },
                  emitters: [
                    {
                      direction: "top-left",
                      rate: {
                        delay: 0.1,
                        quantity: 0.25
                      },
                      position: {
                        x: 100,
                        y: 50
                      },
                      size: {
                        width: 0,
                        height: 0
                      },
                      particles: {
                        move: {
                          angle: {
                            offset: 30,
                            value: 45
                          }
                        }
                      }
                    }
                  ]
                });
              }, 500);
            }, 1000);
          }, 1000);
        }, 500);
      } else {
        Swal.fire({
          // icon: 'error',
          // title: 'You lost',
          // text: `TX ID: ${receipt.transactionHash}`,
          html:`<div id="WanimationContainer">
                  <div id="WinnerR">
                    <img src="${baseURI}${p1}.png">
                  </div>
                  <img src="assets/vs.png" id="Wmerger">
                  <div id="WinnerL">
                    <img src="${baseURI}${id}.png">
                  </div>
                </div>`,
        })
        
        
        var element = document.getElementById("WanimationContainer");
        element.classList.add("Wflashlight");

        setTimeout(() => {
          document.getElementById("Wmerger").style.transform = "scale(0)";
          setTimeout(() => {
            audioLose.play();
            document.getElementById("WinnerR").style.transform = "scale(0)";
            setTimeout(() => {
              document.getElementById("WinnerR").style.display = "none";
              setTimeout(() => {
                audioWawa.play();
                document.getElementById("WinnerL").style.transform = "scale(1.5)";
              }, 500);
            }, 1000);
          }, 1000);
        }, 500);
      }
      
      clearBattleDom();
      updateBattles();
      console.log(`completed. ${receipt.transactionHash}`)
    })
    .on('error', function (error) {
      if (error.code === 4001) {
        Swal.fire({
          icon: 'error',
          title: 'Oops',
          text: 'User denied transaction signature',
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops',
          text: error.message,
        })
      }
      console.log(`Failed. ${error?.message}`)
    })
    .catch(error => {
      console.log(`Error. ${error?.message}`)
    });
  }
}

async function endBattle(battleId) {
  console.log(battleId);
  let contract = await new web3.eth.Contract(mainnetAbi, mainnetContract);
  let account = await web3.eth.getAccounts();
  
  console.log(account[0]);
  contract.methods.endBattle(battleId).send({from: account[0]})
  .on('transactionHash', function (hash) {
    Swal.fire({
      title: `Ending the game...`,
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading()
      }
    })
    console.log(`in process ${hash}`)
  })
  .on('receipt', function (receipt) {
    Swal.fire({
      icon: 'success',
      title: 'You ended the game, check your Kraken power. Your NFT is more powerful now.',
      text: `TX ID: ${receipt.transactionHash}`,
    })
    clearBattleDom();
    updateBattles();
    updateMonster();
    getMonsterPower();
    console.log(`completed. ${receipt.transactionHash}`)
  })
  .on('error', function (error) {
    if (error.code === 4001) {
      Swal.fire({
        icon: 'error',
        title: 'Oops',
        text: 'User denied transaction signature',
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops',
        text: error.message,
      })
    }
    console.log(`Failed. ${error?.message}`)
  })
  .catch(error => {
    console.log(`Error. ${error?.message}`)
  });
}

//Approve before battle wager 
async function createBattle() {
  if (window.ethereum) {
    var contractWager = new web3.eth.Contract(wagerAbi, wagerContract);
    const chainId = await ethereum.request({ method: 'eth_chainId' });
    let account = await web3.eth.getAccounts();
    if (account.length == 0 || chainId != 0x61) {
      Swal.fire({
        icon: 'warning',
        title: 'Connection error',
        text: `Please connect to Metamask and then switch to BSC mainnet.`,
      })
    } else {
      let account = await web3.eth.getAccounts();
    //check if approve method used before
      const approval = await contractWager.methods.allowance(account[0], mainnetContract).call();
      
      if (approval > 0) {
        createBattle2(1); //trigger create battle function
      } else {
        let account = await web3.eth.getAccounts();
        const maxUint = 999999999999999999999999;
        let amount = new BigNumber(maxUint).multipliedBy(new BigNumber(10).exponentiatedBy(18)).toString(10)

        contractWager.methods.approve(mainnetContract, amount).send({ from: account[0] })
          .on('transactionHash', function (hash) {
            Swal.fire({
              title: `Approve is needed one time. Payment authorization in process. Enter token ID and confirm deposit after authorization completed`,
              showConfirmButton: false,
              allowOutsideClick: false,
              allowEscapeKey: false,
              didOpen: () => {
                Swal.showLoading()
              }
            })
            console.log(`Payment authorization in process. ${hash}`)
          })
          .on('receipt', function (receipt) {
            Swal.fire({
              icon: 'success',
              title: 'Congrats',
              text: `Payment authorization accepted. ${receipt.transactionHash}`,
            })
            console.log(`Payment authorization accepted. ${receipt.transactionHash}`);

            createBattle2(1); //trigger create battle function
          })
          .on('error', function (error) {
            if (error.code === 4001) {
              Swal.fire({
                icon: 'error',
                title: 'Oops',
                text: 'User denied transaction signature',
              })
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops',
                text: error.message,
              })
            }
            console.log(`Payment authorization failed. ${error?.message}`)
          })
          .catch((error) => {
            console.log(`Payment authorization error. ${error?.message}`)
          });
      }
    }
  } else {
    const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
        
    Toast.fire({
      icon: 'warning',
      title: 'No provider was found'
    })
    return;
  }
}

async function createBattle2(payment) {
  let contract = await new web3.eth.Contract(mainnetAbi, mainnetContract);
  let account = await web3.eth.getAccounts();
  const price = new BigNumber(payment).multipliedBy(1000000000000000000n);

  const { value: id } = await Swal.fire({
    input: 'text',
    inputLabel: 'Enter the Token Id',
    inputPlaceholder: '0'
  })

  if(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You will deposit ${payment} BUSD`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, continue!'
    }).then((result) => {
      if (result.isConfirmed) {
        contract.methods.createBattle(id).send({from: account[0]})
        .on('transactionHash', function (hash) {
          Swal.fire({
            html: `<div class="swalCreateBattle"><img class="slide-fwd-center" src="${baseURI}${id}.png"><img src="assets/vs.png" height="50"><img class="slide-fwd-center" src="assets/qm.png"></div>`,
            title: `Creating battle...`,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            // didOpen: () => {
            //   Swal.showLoading()
            // }
          })
          console.log(`in process ${hash}`)
        })
        .on('receipt', function (receipt) {
          Swal.fire({
            icon: 'success',
            title: 'You created battle. Check your battle on list',
            text: `TX ID: ${receipt.transactionHash}`,
          })
          clearBattleDom();
          updateBattles();
          console.log(`completed. ${receipt.transactionHash}`)
        })
        .on('error', function (error) {
          if (error.code === 4001) {
            Swal.fire({
              icon: 'error',
              title: 'Oops',
              text: 'User denied transaction signature',
            })
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops',
              text: error.message,
            })
          }
          console.log(`Failed. ${error?.message}`)
        })
        .catch(error => {
          console.log(`Error. ${error?.message}`)
        });
      }
    })
    
  }
}